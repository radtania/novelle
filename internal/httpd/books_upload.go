package httpd

import (
	"encoding/csv"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/radtania/booksai/internal/books/model"
)

func (a *App) handleBooksUpload(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	err := r.ParseMultipartForm(10 << 20) // 10 MB limit
	if err != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}

	// Get the email field
	email, err := a.getAuthenticatedEmail(r)
	if err != nil || email == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	file, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Unable to get uploaded file", http.StatusBadRequest)
		return
	}

	defer file.Close()

	uploadedBooks, err := booksFromCSVFile(file)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to read CSV file: %v", err), http.StatusBadRequest)
		return
	}
	a.Logger.Info("Books uploaded successfully", "count", len(uploadedBooks))

	authUser, err := a.AuthManager.Repository.GetUserByEmail(r.Context(), email)
	if err != nil {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	// Convert to model.User (layer books)
	user := model.User{
		ID:    authUser.ID,
		Name:  authUser.Name,
		Email: authUser.Email,
	}

	err = a.BooksManager.CreateMultipleBookForUser(user, uploadedBooks)
	if err != nil {
		a.Logger.Error("failed to save books", "error", err)
		http.Error(w, fmt.Sprintf("Unable to save books: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// booksFromCSVFile parses a Goodreads CSV export file
// and converts each record into a Book domain model.
func booksFromCSVFile(file io.Reader) ([]model.Book, error) {
	reader := csv.NewReader(file)
	reader.TrimLeadingSpace = true

	header, err := reader.Read()
	if err != nil {
		return nil, fmt.Errorf("unable to read header: %w", err)
	}

	var readBooks []model.Book
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("unable to read record: %w", err)
		}

		book := model.Book{}
		for i, field := range record {
			switch header[i] {
			case "Title":
				book.Title = field
			case "Author":
				book.Author = field
			case "My Rating":
				myRatingInt, _ := strconv.Atoi(field)
				book.MyRating = myRatingInt
			case "Average Rating":
				avgRatingFloat, _ := strconv.ParseFloat(field, 10)
				book.AverageRating = avgRatingFloat
			case "Number of Pages":
				numberOfPagesInt, _ := strconv.Atoi(field)
				book.NumberOfPages = numberOfPagesInt
			case "Original Publication Year":
				originalPublishedAt, _ := time.Parse("2006", field)
				book.PublishedAt = originalPublishedAt
			case "Date Read":
				if field != "" {
					if t, err := time.Parse("2006/01/02", field); err == nil {
						book.ReadAt = &t
					}
				}

			case "Date Added":
				if field != "" {
					if t, err := time.Parse("2006/01/02", field); err == nil {
						book.AddedAt = t
					}
				}
			case "Exclusive Shelf":
				book.Status = field
			case "My Review":
				book.Review = field
			case "Read Count":
				readCountInt, _ := strconv.Atoi(field)
				book.ReadCount = readCountInt
			default:
			}
		}

		readBooks = append(readBooks, book)
	}

	return readBooks, nil
}
