# booksai

Using AI with books

git checkout -b [name-branch]

## How to start the program

Run: make start

## How to upload books

### To upload files

Export .csv with books from <https://www.goodreads.com/review/import> and run:

```curl
curl --location 'localhost:8080/books/upload' \
--form 'file="[export_path_file]"' \
--form 'email="taniarad222@gmail.com"'
```

### To get uploaded books

```curl
curl --location 'localhost:8080/books?email=taniarad222%40gmail.com'
```

### To get recommendations

```curl
curl --location --request POST 'localhost:8080/recommendations?email=taniarad222%40gmail.com'
```
