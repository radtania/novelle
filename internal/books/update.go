package books

import "time"

func (m *Manager) UpdateUserBook(userID, bookID uint64, myRating int, status, review string, readAt *time.Time) error {
	return m.Repository.UpdateUserBook(userID, bookID, myRating, status, review, readAt)
}
