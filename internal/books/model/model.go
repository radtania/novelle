package model

import "time"

type (
	Book struct {
		ID            uint64     `json:"id"`
		Title         string     `json:"title"`
		Author        string     `json:"author"`
		MyRating      int        `json:"my_rating"`
		NumberOfPages int        `json:"number_of_pages"`
		AverageRating float64    `json:"average_rating"`
		Status        string     `json:"status"`
		Review        string     `json:"review"`
		PublishedAt   time.Time  `json:"published_at"`
		AddedAt       time.Time  `json:"added_at"`
		ReadAt        *time.Time `json:"read_at"`
		ReadCount     int        `json:"read_count"`
	}
	User struct {
		ID    uint64
		Name  string
		Email string
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
	Stats struct {
		TotalRead          int            `json:"total_read"`
		TotalPages         int            `json:"total_pages"`
		AvgPages           int            `json:"avg_pages"`
		AvgRating          float64        `json:"avg_rating"`
		RatingSum          int            `json:"-"`
		RatingCount        int            `json:"-"`
		RatingDistribution []int          `json:"rating_distribution"`
		TopAuthors         []AuthorCount  `json:"top_authors"`
		TopBooks           []BookSummary  `json:"top_books"`
		StatusBreakdown    map[string]int `json:"status_breakdown"`
		TotalBooks         int            `json:"total_books"`
		RecentlyAdded      []BookSummary  `json:"recently_added"`
		CurrentlyReading   *BookSummary   `json:"currently_reading"`
	}

	AuthorCount struct {
		Author string `json:"author"`
		Count  int    `json:"count"`
	}

	BookSummary struct {
		Title    string `json:"title"`
		Author   string `json:"author"`
		MyRating int    `json:"my_rating"`
		Status   string `json:"status"`
	}
)
