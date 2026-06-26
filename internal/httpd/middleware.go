package httpd

import (
	"net/http"
)

func (a *App) getAuthenticatedEmail(r *http.Request) (string, error) {
	cookie, err := r.Cookie("session_email")
	if err != nil {
		return "", err
	}
	return cookie.Value, nil
}
