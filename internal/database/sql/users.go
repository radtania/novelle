package sql

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/jackc/pgx/v5/pgconn"
	"golang.org/x/crypto/bcrypt"
)

// CREATE USER (Register)

func (r Repository) CreateUser(
	ctx context.Context,
	name string,
	email string,
	password string,
) (*User, error) {

	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	query := `
		INSERT INTO users (name, email, password_hash)
		VALUES ($1, $2, $3)
		RETURNING id, name, email, password_hash, created_at
	`

	var user User

	err = r.DB.QueryRowContext(
		ctx,
		query,
		name,
		email,
		string(hashedPassword),
	).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.CreatedAt,
	)

	if err != nil {
		// PostgreSQL duplicate key error
		if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23505" {
			return nil, fmt.Errorf("email already exists")
		}
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return &user, nil
}

// GET USER BY EMAIL

func (r Repository) GetUserByEmail(
	ctx context.Context,
	email string,
) (*User, error) {

	query := `
		SELECT id, name, email, password_hash, created_at
		FROM users
		WHERE email = $1
	`

	var user User

	err := r.DB.QueryRowContext(ctx, query, email).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.CreatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user not found")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	return &user, nil
}

// LOGIN USER

func (r Repository) LoginUser(
	ctx context.Context,
	email string,
	password string,
) (*User, error) {

	user, err := r.GetUserByEmail(ctx, email)
	if err != nil {
		return nil, fmt.Errorf("invalid email or password")
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(user.PasswordHash),
		[]byte(password),
	)
	if err != nil {
		return nil, fmt.Errorf("invalid email or password")
	}

	return user, nil
}
func (r Repository) UpdateUserName(ctx context.Context, email, name string) error {
	_, err := r.DB.ExecContext(ctx, `
		UPDATE users SET name = $1 WHERE email = $2
	`, name, email)
	if err != nil {
		return fmt.Errorf("failed to update name: %w", err)
	}
	return nil
}
func (r Repository) UpdateUserPassword(ctx context.Context, email, currentPassword, newPassword string) error {
	user, err := r.GetUserByEmail(ctx, email)
	if err != nil {
		return fmt.Errorf("user not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(currentPassword)); err != nil {
		return fmt.Errorf("current password is incorrect")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	_, err = r.DB.ExecContext(ctx, `
		UPDATE users SET password_hash = $1 WHERE email = $2
	`, string(hashed), email)
	if err != nil {
		return fmt.Errorf("failed to update password: %w", err)
	}
	return nil
}
