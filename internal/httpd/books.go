package httpd

import "net/http"

func (a *App) handleBooks(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		a.handleBooksGet(w, r)
	case http.MethodPost:
		a.handleBooksCreate(w, r)
	case http.MethodDelete:
		a.handleBooksDelete(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
