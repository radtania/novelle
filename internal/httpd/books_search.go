package httpd

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

type openLibraryResponse struct {
	Docs []openLibraryDoc `json:"docs"`
}

type openLibraryDoc struct {
	Title            string   `json:"title"`
	AuthorName       []string `json:"author_name"`
	NumberOfPages    int      `json:"number_of_pages_median"`
	FirstPublishYear int      `json:"first_publish_year"`
}

type bookSearchResult struct {
	Title  string `json:"title"`
	Author string `json:"author"`
	Pages  int    `json:"pages"`
	Year   int    `json:"year"`
}

func (a *App) handleBooksSearch(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	q := r.URL.Query().Get("q")
	if len(q) < 2 {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode([]bookSearchResult{})
		return
	}

	apiURL := fmt.Sprintf(
		"https://openlibrary.org/search.json?q=%s&limit=6&fields=title,author_name,number_of_pages_median,first_publish_year",
		url.QueryEscape(q),
	)

	resp, err := http.Get(apiURL)
	if err != nil {
		http.Error(w, "Failed to reach Open Library", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	var olResp openLibraryResponse
	if err := json.NewDecoder(resp.Body).Decode(&olResp); err != nil {
		http.Error(w, "Failed to parse response", http.StatusInternalServerError)
		return
	}

	results := make([]bookSearchResult, 0, len(olResp.Docs))
	for _, doc := range olResp.Docs {
		author := "Unknown author"
		if len(doc.AuthorName) > 0 {
			author = doc.AuthorName[0]
		}
		results = append(results, bookSearchResult{
			Title:  doc.Title,
			Author: author,
			Pages:  doc.NumberOfPages,
			Year:   doc.FirstPublishYear,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}
