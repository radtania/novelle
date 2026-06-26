package books

import "github.com/radtania/booksai/internal/books/model"

// CreateMultipleBookForUser saves multiple books for a given user (e.g. parsed from CSV).
func (m *Manager) CreateMultipleBookForUser(user model.User, books []model.Book) error {
	return m.Repository.CreateMultipleBookForUser(user, books)
}

// CreateRecommendation stores the AI-generated recommendation in the database.
func (m *Manager) CreateRecommendation(recommendation model.Recommendation) error {
	return m.Repository.InsertRecommendation(recommendation)
}
