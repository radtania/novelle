package httpd

import (
	"log/slog"

	"github.com/radtania/booksai/internal/auth"
	"github.com/radtania/booksai/internal/books"
	"github.com/radtania/booksai/internal/llm"
)

// App holds application dependencies used by HTTP handlers.
// It acts as a dependency container for business logic, logging, and LLM integration
type App struct {
	BooksManager *books.Manager
	AuthManager  *auth.Manager
	Logger       *slog.Logger
	LLM          llm.Manager
}
