package httpd

import (
	"context"
	"net/http"
	"time"
)

type (
	Server struct {
		server *http.Server
	}
	ServerConfig struct {
		Name string
		Addr string
		App  App
	}
)

// NewServer initializes HTTP routes and configures timeouts for the web server.
func NewServer(config ServerConfig) (*Server, error) {
	router := http.NewServeMux()
	router.Handle("/books/upload", http.HandlerFunc(config.App.handleBooksUpload))
	router.Handle("/books", http.HandlerFunc(config.App.handleBooks))
	router.Handle("/recommendations", http.HandlerFunc(config.App.handleRecommendations))
	router.Handle("/auth/register", http.HandlerFunc(config.App.handleRegister))
	router.Handle("/auth/login", http.HandlerFunc(config.App.handleLogin))
	router.Handle("/auth/logout", http.HandlerFunc(config.App.handleLogout))
	router.Handle("/books/update", http.HandlerFunc(config.App.handleBooksUpdate))
	router.Handle("/profile/name", http.HandlerFunc(config.App.handleUpdateName))
	router.Handle("/profile/password", http.HandlerFunc(config.App.handleChangePassword))
	router.Handle("/books/search", http.HandlerFunc(config.App.handleBooksSearch))
	router.Handle("/books/stats", http.HandlerFunc(config.App.handleBooksStats))
	router.Handle("/profile/me", http.HandlerFunc(config.App.handleGetProfile))

	server := &http.Server{
		Addr:         config.Addr,
		Handler:      router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	return &Server{
		server: server,
	}, nil
}

func (s *Server) Start() error {
	if err := s.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return err
	}

	return nil
}

func (s *Server) Shutdown() error {
	if err := s.server.Shutdown(context.TODO()); err != nil {
		return err
	}

	return nil
}
