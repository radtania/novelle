package books

import "github.com/radtania/booksai/internal/database/sql"

type Manager struct {
	Repository *sql.Repository
}
