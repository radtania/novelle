package sql

import (
	"database/sql"
	"fmt"
	"time"
)

func (r Repository) UpdateUserBook(userID, bookID uint64, myRating int, status, review string, readAt *time.Time) error {
	query := `
		UPDATE user_books
		SET my_rating = $1,
			status = $2,
			review = $3,
			read_at = $4
		WHERE user_id = $5 AND book_id = $6
	`

	var nullReadAt sql.NullTime
	if readAt != nil {
		nullReadAt = sql.NullTime{Time: *readAt, Valid: true}
	}

	result, err := r.DB.Exec(query, myRating, status, review, nullReadAt, userID, bookID)
	if err != nil {
		return fmt.Errorf("failed to update book: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("book not found for this user")
	}

	return nil
}
