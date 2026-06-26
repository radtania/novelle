package gemini

import (
	"context"

	"google.golang.org/genai"
)

// Client wraps the Google Gemini API and provides
// a method for generating AI recommendations based on a prompt.
type Client struct {
	Client *genai.Client
}

func NewClient(token string) Client {
	geminiClient, _ := genai.NewClient(context.Background(), &genai.ClientConfig{
		APIKey:  token,
		Backend: genai.BackendGeminiAPI,
	})

	client := Client{
		Client: geminiClient,
	}

	return client
}

func (c Client) GetRecommendation(ctx context.Context, prompt string) (string, error) {
	result, err := c.Client.Models.GenerateContent(
		ctx,
		"gemini-2.5-flash",
		genai.Text(prompt),
		nil,
	)
	if err != nil {
		return "", err
	}

	return result.Text(), nil
}
