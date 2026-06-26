package httpd

import (
	"context"
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/radtania/booksai/internal/books/model"
)

func (a *App) handleRecommendations(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
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

	user := model.User{
		ID:    authUser.ID,
		Name:  authUser.Name,
		Email: authUser.Email,
	}

	recommendation, err := a.getRecommendation(r.Context(), user)
	if err != nil {
		http.Error(w, "Unable to get recommendation", http.StatusInternalServerError)
		slog.Error("Failed to get recommendation", "error", err)

		return
	}

	jsonRec, err := json.Marshal(recommendation)
	if err != nil {
		http.Error(w, "Unable to marshal result", http.StatusInternalServerError)
		slog.Error("Failed to marshal result", "error", err)

		return
	}

	w.Write(jsonRec)
}

// getRecommendation retrieves an existing recommendation from the database.
// If none exists, it generates one using the LLM, stores it, and returns it.
func (a *App) getRecommendation(ctx context.Context, user model.User) (*model.Recommendation, error) {
	currentBooks, err := a.BooksManager.GetByUserID(user.ID)
	if err != nil {
		return nil, err
	}
	currentCount := len(currentBooks)

	existing, err := a.BooksManager.GetRecommendation(user)
	if err == nil {
		diff := currentCount - existing.BookCount
		if diff < 0 {
			diff = -diff
		}
		if diff < 5 {
			return existing, nil
		}
	}

	recommendation, err := a.LLM.GetRecommendation(ctx, currentBooks)
	if err != nil {
		slog.Error("Failed to get recommendation", "error", err)
		return nil, err
	}

	recommendation.UserID = int(user.ID)
	recommendation.BookCount = currentCount
	err = a.BooksManager.CreateRecommendation(*recommendation)
	if err != nil {
		slog.Error("Failed to create recommendation in db", "error", err)
	}

	return recommendation, nil
}
