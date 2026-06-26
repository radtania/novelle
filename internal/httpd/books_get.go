package httpd

import (
	"encoding/json"
	"log/slog"
	"net/http"
)

// handleBooksGet retrieves all books associated with a user (identified by email).
func (a *App) handleBooksGet(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	email, err := a.getAuthenticatedEmail(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Luăm user real din DB
	authUser, err := a.AuthManager.Repository.GetUserByEmail(r.Context(), email)
	if err != nil {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	books, err := a.BooksManager.GetByUserID(authUser.ID)
	if err != nil {
		http.Error(w, "Unable to get books", http.StatusInternalServerError)
		slog.Error("Failed to get books", "error", err)

		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(books)

}
