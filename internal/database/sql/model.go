package sql

import (
	"database/sql"
	"time"
)

type (
	Book struct {
		ID            uint64
		Title         string
		Author        string
		AverageRating float64
		NumberOfPages int
		PublishedAt   time.Time
		CreatedAt     time.Time
	}
	UserBook struct {
		BookID    uint64
		UserID    uint64
		MyRating  int
		Status    string
		Review    string
		AddedAt   time.Time
		ReadAt    sql.NullTime
		ReadCount int
	}
	User struct {
		ID           uint64
		Name         string
		Email        string
		PasswordHash string
		CreatedAt    time.Time
	}
	UserBookDetailed struct {
		Book
		UserBook
	}
	Recommendation struct {
		UserID             int
		Book               string
		RecentBook         string
		Author             string
		Interest           string
		Personality        string
		FictionalCharacter string
		BookCount          int
	}
)
