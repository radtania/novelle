package sql

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/radtania/booksai/internal/books/model"
)

// Retrieves all books associated with a user via join query.
func (r Repository) GetByUserID(userID uint64) ([]model.Book, error) {
	var books []UserBookDetailed

	rows, err := r.DB.Query(`
	SELECT
		books.id, books.title, books.author, books.average_rating,
		books.number_of_pages, books.published_at, books.created_at,
		user_books.book_id, user_books.user_id, user_books.my_rating,
		user_books.status, user_books.review, user_books.added_at,
		user_books.read_at, user_books.read_count
	FROM books
	JOIN user_books ON books.id = user_books.book_id
	WHERE user_books.user_id = $1
	ORDER BY user_books.added_at DESC;`, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query books: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var book UserBookDetailed
		// Adjust the scan fields to match your Book struct and query columns
		err := rows.Scan(
			&book.ID,
			&book.Title,
			&book.Author,
			&book.AverageRating,
			&book.NumberOfPages,
			&book.PublishedAt,
			&book.CreatedAt,

			// UserBook
			&book.BookID,
			&book.UserID,
			&book.MyRating,
			&book.Status,
			&book.Review,
			&book.AddedAt,
			&book.ReadAt,
			&book.ReadCount,
		)
		if err != nil {
			return nil, err
		}
		books = append(books, book)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return toDomainBooks(books), nil
}

func toDomainBooks(books []UserBookDetailed) []model.Book {
	domainBooks := make([]model.Book, 0, len(books))

	for _, b := range books {
		domainBooks = append(domainBooks, model.Book{
			ID:            b.BookID,
			Title:         b.Title,
			Author:        b.Author,
			MyRating:      b.MyRating,
			NumberOfPages: b.NumberOfPages,
			AverageRating: b.AverageRating,
			Status:        b.Status,
			Review:        b.Review,
			PublishedAt:   b.PublishedAt,
			AddedAt:       b.AddedAt,
			ReadAt:        fromNullTime(b.ReadAt),
			ReadCount:     b.ReadCount,
		})
	}

	return domainBooks
}

func fromNullTime(t sql.NullTime) *time.Time {
	if !t.Valid {
		return nil
	}

	return &t.Time
}
