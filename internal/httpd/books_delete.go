package httpd

import (
	"net/http"
	"strconv"
)

func (a *App) handleBooksDelete(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
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

	err = a.BooksManager.DeleteUserBook(authUser.ID, bookID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
