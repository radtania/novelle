package sql

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/radtania/booksai/internal/books/model"
)

// Inserts or updates multiple books for a user.
// Handles user creation, book upsert, and user-book relation.
func (r Repository) CreateMultipleBookForUser(user model.User, books []model.Book) error {
	dbBooks := fromDomainBooks(books)

	// Inserts a book if it does not exist, otherwise returns existing record.
	for _, b := range dbBooks {
		book, err := r.insertBook(b.Book)
		if err != nil {
			return fmt.Errorf("cannot get or insert book: %w", err)
		}

		bookUser := b.UserBook
		bookUser.UserID = user.ID
		bookUser.BookID = book.ID
		// Inserts or updates the user-book relationship (rating, review, etc.)
		_, err = r.insertUserBook(bookUser)
		if err != nil {
			return fmt.Errorf("cannot get or insert user book: %w", err)
		}
	}

	return nil
}

func (r Repository) insertBook(book Book) (*Book, error) {
	query := `
        WITH ins AS (
            INSERT INTO books (title, author, average_rating, published_at, number_of_pages)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (title, author) DO NOTHING
            RETURNING id, title, author, average_rating, published_at, number_of_pages, created_at
        )
        SELECT id, title, author, average_rating, published_at, number_of_pages, created_at FROM ins
        UNION
        SELECT id, title, author, average_rating, published_at, number_of_pages, created_at FROM books WHERE title = $1 AND author = $2;
    `

	// Execute the query and scan the returning row into user
	err := r.DB.QueryRow(query, book.Title, book.Author, book.AverageRating, book.PublishedAt, book.NumberOfPages).
		Scan(&book.ID, &book.Title, &book.Author, &book.AverageRating, &book.PublishedAt, &book.NumberOfPages, &book.CreatedAt)
	if err != nil {
		return nil, err
	}

	return &book, nil
}

func (r Repository) insertUserBook(bookUser UserBook) (*UserBook, error) {
	query := `
        INSERT INTO user_books (book_id, user_id, my_rating, status, review, read_at, read_count)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (book_id, user_id) DO UPDATE
		SET my_rating = EXCLUDED.my_rating,
    		status = EXCLUDED.status,
    		review = EXCLUDED.review,
    		read_at = EXCLUDED.read_at,
    		read_count = EXCLUDED.read_count
        RETURNING book_id, user_id, my_rating, status, review, added_at, read_at, read_count;
    `

	// Execute the query and scan the returning row into user
	err := r.DB.QueryRow(
		query,
		bookUser.BookID,
		bookUser.UserID,
		bookUser.MyRating,
		bookUser.Status,
		bookUser.Review,
		bookUser.ReadAt,
		bookUser.ReadCount,
	).Scan(
		&bookUser.BookID,
		&bookUser.UserID,
		&bookUser.MyRating,
		&bookUser.Status,
		&bookUser.Review,
		&bookUser.AddedAt,
		&bookUser.ReadAt,
		&bookUser.ReadCount,
	)
	if err != nil {
		return nil, err
	}

	return &bookUser, nil
}

func fromDomainBooks(books []model.Book) []UserBookDetailed {
	dbBooks := make([]UserBookDetailed, 0, len(books))

	for _, b := range books {
		dbBooks = append(dbBooks, UserBookDetailed{
			Book: Book{
				ID:            0,
				Title:         b.Title,
				Author:        b.Author,
				AverageRating: b.AverageRating,
				PublishedAt:   b.PublishedAt,
				NumberOfPages: b.NumberOfPages,
			},
			UserBook: UserBook{
				BookID:    0,
				UserID:    0,
				MyRating:  b.MyRating,
				Status:    b.Status,
				Review:    b.Review,
				AddedAt:   b.AddedAt,
				ReadAt:    toNullTime(b.ReadAt),
				ReadCount: b.ReadCount,
			},
		})
	}

	return dbBooks
}

func toNullTime(t *time.Time) sql.NullTime {
	if t == nil {
		return sql.NullTime{}
	}

	return sql.NullTime{
		Time:  *t,
		Valid: true,
	}
}
