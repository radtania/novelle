package sql

import (
	"fmt"
)

func (r Repository) DeleteUserBook(userID, bookID uint64) error {
	query := `
	DELETE FROM user_books
	WHERE user_id = $1 AND book_id = $2;
	`

	result, err := r.DB.Exec(query, userID, bookID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("book not found for this user")
	}

	return nil
}
