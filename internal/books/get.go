package books

import (
	"github.com/radtania/booksai/internal/books/model"
)

// Get returns all books associated with a specific user.
func (m *Manager) GetByUserID(userID uint64) ([]model.Book, error) {
	return m.Repository.GetByUserID(userID)
}

// GetRecommendation retrieves the stored recommendation for a user.
func (m *Manager) GetRecommendation(user model.User) (*model.Recommendation, error) {
	return m.Repository.GetRecommendation(int(user.ID))
}
