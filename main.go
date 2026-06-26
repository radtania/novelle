package main

import (
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/radtania/booksai/internal/auth"
	"github.com/radtania/booksai/internal/books"
	"github.com/radtania/booksai/internal/configs"
	internalsql "github.com/radtania/booksai/internal/database/sql"
	"github.com/radtania/booksai/internal/httpd"
	"github.com/radtania/booksai/internal/llm"
	"github.com/radtania/booksai/internal/llm/gemini"
	"github.com/radtania/booksai/internal/llm/huggingface"
)

func main() {
	//Load application configuration (DB URL, LLM token, etc.)
	cfg, err := configs.Load()
	if err != nil {
		slog.Error("failed to load configuration", "error", err)
		os.Exit(-1)
	}

	db, err := internalsql.CreateDBConnection(cfg.RdsURL) //foloseste url-ul din config si creeaza conexiunea
	if err != nil {
		slog.Error("failed to connect to database", "error", err)
		os.Exit(-1)
	}
	defer db.Close() //cand aplicatia se opreste db se inchide automat

	// Run database migrations on startup
	if err = internalsql.Migrate(db); err != nil {
		slog.Error("failed to run database migrations", "error", err)
		os.Exit(-1)
	}

	// Create HTTP server and inject dependencies (DB, LLM, Logger)
	server, err := httpd.NewServer(httpd.ServerConfig{ //crearea server-ului
		Name: "booksai",
		Addr: ":8080",
		App: httpd.App{ //dependency injection
			BooksManager: &books.Manager{
				Repository: &internalsql.Repository{
					DB: db,
				}, //(managerul nu creeaza db, i primeste din exterior)
			},
			AuthManager: &auth.Manager{
				Repository: &internalsql.Repository{
					DB: db,
				},
			},
			Logger: slog.Default(),
			LLM: llm.Manager{
				HuggingFace: huggingface.NewClient(&http.Client{}, cfg.LLMToken),
				Gemini:      gemini.NewClient(cfg.LLMToken),
			},
		},
	})
	if err != nil {
		slog.Error("failed to create server", "error", err)
		os.Exit(-1)
	}

	// Start the server in a separate goroutine to avoid blocking the main thread and allow graceful shutdown.
	go func() {
		slog.Info("starting server...")
		err := server.Start()
		if err != nil {
			slog.Error("failed to start server", "error", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server.
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)
	<-signals

	slog.Info("shutting down server...")
	if err := server.Shutdown(); err != nil {
		slog.Error("failed to shutdown server", "error", err)
	}

	slog.Info("server shutdown complete")
}
