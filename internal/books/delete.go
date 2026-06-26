package books

func (m *Manager) DeleteUserBook(userID, bookID uint64) error {
	return m.Repository.DeleteUserBook(userID, bookID)
}
