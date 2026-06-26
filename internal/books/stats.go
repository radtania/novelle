package books

import (
	"time"

	"github.com/radtania/booksai/internal/books/model"
)

func (m *Manager) GetStats(userID uint64) (*model.Stats, error) {
	books, err := m.Repository.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	stats := &model.Stats{
		StatusBreakdown:    map[string]int{},
		RatingDistribution: make([]int, 5),
	}

	authorMap := map[string]int{}

	for _, b := range books {
		stats.TotalBooks++
		stats.StatusBreakdown[b.Status]++

		if b.Status == "currently-reading" && stats.CurrentlyReading == nil {
			stats.CurrentlyReading = &model.BookSummary{
				Title:  b.Title,
				Author: b.Author,
				Status: b.Status,
			}
		}

		stats.RecentlyAdded = append(stats.RecentlyAdded, model.BookSummary{
			Title:  b.Title,
			Author: b.Author,
			Status: b.Status,
		})

		if b.Status != "read" {
			continue
		}

		// toate cartile citite — pages, rating, top autori, top carti
		stats.TotalPages += b.NumberOfPages

		if b.MyRating >= 1 && b.MyRating <= 5 {
			stats.RatingDistribution[b.MyRating-1]++
			stats.RatingSum += b.MyRating
			stats.RatingCount++
		}

		if b.Author != "" {
			authorMap[b.Author]++
		}

		if b.MyRating > 0 {
			stats.TopBooks = append(stats.TopBooks, model.BookSummary{
				Title:    b.Title,
				Author:   b.Author,
				MyRating: b.MyRating,
				Status:   b.Status,
			})
		}

		// reading goal — doar anul curent
		if b.ReadAt != nil && b.ReadAt.Year() == time.Now().Year() {
			stats.TotalRead++
		}
	}

	if stats.TotalPages > 0 && stats.StatusBreakdown["read"] > 0 {
		stats.AvgPages = stats.TotalPages / stats.StatusBreakdown["read"]
	}

	if stats.RatingCount > 0 {
		stats.AvgRating = float64(stats.RatingSum) / float64(stats.RatingCount)
	}

	for author, count := range authorMap {
		stats.TopAuthors = append(stats.TopAuthors, model.AuthorCount{
			Author: author,
			Count:  count,
		})
	}
	sortAuthorsByCount(stats.TopAuthors)
	if len(stats.TopAuthors) > 5 {
		stats.TopAuthors = stats.TopAuthors[:5]
	}

	sortBooksByRating(stats.TopBooks)
	if len(stats.TopBooks) > 5 {
		stats.TopBooks = stats.TopBooks[:5]
	}

	for i, j := 0, len(stats.RecentlyAdded)-1; i < j; i, j = i+1, j-1 {
		stats.RecentlyAdded[i], stats.RecentlyAdded[j] = stats.RecentlyAdded[j], stats.RecentlyAdded[i]
	}
	if len(stats.RecentlyAdded) > 3 {
		stats.RecentlyAdded = stats.RecentlyAdded[:3]
	}

	return stats, nil
}

func sortAuthorsByCount(authors []model.AuthorCount) {
	for i := 1; i < len(authors); i++ {
		for j := i; j > 0 && authors[j].Count > authors[j-1].Count; j-- {
			authors[j], authors[j-1] = authors[j-1], authors[j]
		}
	}
}

func sortBooksByRating(books []model.BookSummary) {
	for i := 1; i < len(books); i++ {
		for j := i; j > 0 && books[j].MyRating > books[j-1].MyRating; j-- {
			books[j], books[j-1] = books[j-1], books[j]
		}
	}
}
