package httpd

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"
)

func (a *App) handleBooksUpdate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
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

	bookIDParam := r.URL.Query().Get("book_id")
	if bookIDParam == "" {
		http.Error(w, "Missing book_id", http.StatusBadRequest)
		return
	}

	bookID, err := strconv.ParseUint(bookIDParam, 10, 64)
	if err != nil {
		http.Error(w, "Invalid book_id", http.StatusBadRequest)
		return
	}

	var input struct {
		MyRating int        `json:"my_rating"`
		Status   string     `json:"status"`
		Review   string     `json:"review"`
		ReadAt   *time.Time `json:"read_at"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if input.Status != "read" {
		input.MyRating = 0
		input.ReadAt = nil
	}

	err = a.BooksManager.UpdateUserBook(
		authUser.ID,
		bookID,
		input.MyRating,
		input.Status,
		input.Review,
		input.ReadAt,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
