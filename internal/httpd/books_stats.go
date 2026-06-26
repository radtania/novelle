package httpd

import (
	"encoding/json"
	"log/slog"
	"net/http"
)

func (a *App) handleBooksStats(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	email, err := a.getAuthenticatedEmail(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	authUser, err := a.AuthManager.Repository.GetUserByEmail(r.Context(), email)
	if err != nil {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	stats, err := a.BooksManager.GetStats(authUser.ID)
	if err != nil {
		http.Error(w, "Unable to get stats", http.StatusInternalServerError)
		slog.Error("Failed to get stats", "error", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}
