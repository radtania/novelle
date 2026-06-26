package sql

import (
	"database/sql"
	"fmt"

	"github.com/radtania/booksai/internal/books/model"
)

func (r Repository) InsertRecommendation(rec model.Recommendation) error {
	query := `
    INSERT INTO recommendations (
        user_id, book, recent_book, author, interest, personality, fictional_character, book_count
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (user_id) DO UPDATE SET
        book = EXCLUDED.book,
        recent_book = EXCLUDED.recent_book,
        author = EXCLUDED.author,
        interest = EXCLUDED.interest,
        personality = EXCLUDED.personality,
        fictional_character = EXCLUDED.fictional_character,
        book_count = EXCLUDED.book_count;
    `

	_, err := r.DB.Exec(query,
		rec.UserID,
		rec.Book,
		rec.RecentBook,
		rec.Author,
		rec.Interest,
		rec.Personality,
		rec.FictionalCharacter,
		rec.BookCount,
	)
	if err != nil {
		return fmt.Errorf("failed to insert/update recommendation: %w", err)
	}
	return nil
}

func (r Repository) GetRecommendation(userID int) (*model.Recommendation, error) {
	var rec model.Recommendation

	row := r.DB.QueryRow(`
        SELECT user_id, book, recent_book, author, interest, personality, fictional_character, book_count
        FROM recommendations
        WHERE user_id = $1
    `, userID)

	err := row.Scan(
		&rec.UserID,
		&rec.Book,
		&rec.RecentBook,
		&rec.Author,
		&rec.Interest,
		&rec.Personality,
		&rec.FictionalCharacter,
		&rec.BookCount,
	)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("no recommendation found for user_id %d", userID)
	} else if err != nil {
		return nil, fmt.Errorf("failed to get recommendation: %w", err)
	}

	return &rec, nil
}
