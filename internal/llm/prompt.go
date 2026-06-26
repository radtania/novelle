package llm

import (
	_ "embed"
	"fmt"

	"github.com/radtania/booksai/internal/books/model"
)

//go:embed prompt.txt
var Prompt string

// BooksToString converts a list of books into a formatted string
// used inside the AI prompt.
func BooksToString(books []model.Book) string {
	s := ""
	for _, b := range books {
		line := fmt.Sprintf("%s,%s,%s,%d\n", b.Title, b.Author, b.Status, b.MyRating)
		s = fmt.Sprintf("%s%s", s, line)
	}

	return s
}

func FilterToReadBooks(books []model.Book) []model.Book {
	readBooks := []model.Book{}

	for _, b := range books {
		if b.Status == "read" {
			readBooks = append(readBooks, b)
		}
	}

	return readBooks
}
