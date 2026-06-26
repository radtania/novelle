package huggingface

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
)

const (
	url      = "https://api-inference.huggingface.co/models/"
	modelURL = "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"
)

// Client implements a simple HTTP wrapper for HuggingFace inference API.
type Client struct {
	client *http.Client
	token  string
}

func NewClient(cli *http.Client, token string) Client {
	client := Client{
		client: cli,
		token:  token,
	}

	return client
}

func (c Client) GetRecommendation(ctx context.Context, prompt string) (string, error) {
	input := map[string]any{
		"inputs": prompt,
	}

	jsonInput, err := json.Marshal(input)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", fmt.Sprintf("%s%s", url, modelURL), bytes.NewBuffer(jsonInput))
	if err != nil {
		return "", err
	}

	req.Header.Set("Authorization", "Bearer "+c.token)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	slog.Info("Response", "body", string(body))

	// Parse and return each field in a struct.

	return string(body), nil
}
