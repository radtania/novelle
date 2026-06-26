package auth

import (
	"context"

	internalsql "github.com/radtania/booksai/internal/database/sql"
)

type Manager struct {
	Repository *internalsql.Repository
}

func (m *Manager) Register(ctx context.Context, name, email, password string) (*internalsql.User, error) {
	if err := validateRegister(name, email, password); err != nil {
		return nil, err
	}
	return m.Repository.CreateUser(ctx, name, email, password)
}

func (m *Manager) Login(ctx context.Context, email, password string) (*internalsql.User, error) {
	return m.Repository.LoginUser(ctx, email, password)
}
