package sql

import (
	"database/sql"
	"fmt"

	_ "github.com/jackc/pgx/v5/stdlib" // PostgreSQL driver
)

func CreateDBConnection(rdsURL string) (*sql.DB, error) {
	db, err := sql.Open("pgx", rdsURL)
	if err != nil {
		return nil, fmt.Errorf("failed to open connection: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return db, nil

}
