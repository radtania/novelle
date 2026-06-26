# Use the official Golang image with the latest version. https://hub.docker.com/_/golang
FROM golang:latest

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the application source code
COPY . .

# Build the Go app
RUN go build -o app .

# Expose port 8080
EXPOSE 8080

# Run the app
CMD ["./app"]