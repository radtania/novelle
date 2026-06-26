package llm

import (
	"context"
	"fmt"
	"strings"

	"github.com/radtania/booksai/internal/books/model"
	"github.com/radtania/booksai/internal/llm/gemini"
	"github.com/radtania/booksai/internal/llm/huggingface"
)

type Manager struct {
	HuggingFace huggingface.Client
	Gemini      gemini.Client
}

func (m Manager) GetRecommendation(ctx context.Context, books []model.Book) (*model.Recommendation, error) {
	result, err := m.Gemini.GetRecommendation(ctx, strings.ReplaceAll(Prompt, "[REPLACE]", BooksToString(books)))
	if err != nil {
		return nil, fmt.Errorf("cannot get recommendations: %w", err)
	}

	result = strings.ReplaceAll(result, "**", "")
	result = strings.ReplaceAll(result, "*", "")

	return &model.Recommendation{
		Book:               parseValue(result, "Book recommendation all time:"),
		RecentBook:         parseValue(result, "Recent recommendation:"),
		Author:             parseValue(result, "Author:"),
		Interest:           parseValue(result, "Interest:"),
		Personality:        parseValue(result, "Personality:"),
		FictionalCharacter: parseValue(result, "Fictional character:"),
	}, nil
}

func parseValue(message, tag string) string {
	_, fieldValue, found := strings.Cut(message, tag)

	if !found {
		return ""
	}

	return strings.TrimSpace(strings.Split(fieldValue, "\n")[0])
}
