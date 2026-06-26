package httpd

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/radtania/booksai/internal/books/model"
)

func (a *App) handleBooksCreate(w http.ResponseWriter, r *http.Request) {
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

	var input struct {
		Title         string     `json:"title"`
		Author        string     `json:"author"`
		AverageRating float64    `json:"average_rating"`
		NumberOfPages int        `json:"number_of_pages"`
		PublishedAt   *time.Time `json:"published_at"`
		MyRating      int        `json:"my_rating"`
		Status        string     `json:"status"`
		Review        string     `json:"review"`
		ReadCount     int        `json:"read_count"`
		ReadAt        *time.Time `json:"read_at"`
	}

	err = json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	if input.Status != "read" {
		input.MyRating = 0
		input.ReadAt = nil
	}

	publishedAt := time.Date(1970, 1, 1, 0, 0, 0, 0, time.UTC)
	if input.PublishedAt != nil {
		publishedAt = *input.PublishedAt
	}

	book := model.Book{
		Title:         input.Title,
		Author:        input.Author,
		AverageRating: input.AverageRating,
		NumberOfPages: input.NumberOfPages,
		PublishedAt:   publishedAt,
		MyRating:      input.MyRating,
		Status:        input.Status,
		Review:        input.Review,
		ReadCount:     input.ReadCount,
		AddedAt:       time.Now(),
		ReadAt:        input.ReadAt,
	}

	user := model.User{
		ID:    authUser.ID,
		Name:  authUser.Name,
		Email: authUser.Email,
	}

	err = a.BooksManager.CreateMultipleBookForUser(user, []model.Book{book})
	if err != nil {
		http.Error(w, "Unable to save book", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
