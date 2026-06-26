CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    average_rating FLOAT,
    published_at TIMESTAMP,
    number_of_pages INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(title, author)
);

CREATE TABLE user_books (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    status TEXT, -- e.g., 'read', 'to-read', etc.
    my_rating INTEGER,
    review TEXT,
    added_at TIMESTAMP NOT NULL DEFAULT NOW(),
    read_at TIMESTAMP,
    read_count INTEGER,
    UNIQUE(user_id, book_id)
);

CREATE TABLE recommendations (
    user_id INTEGER PRIMARY KEY,
    book TEXT,
    recent_book TEXT,
    author TEXT,
    interest TEXT,
    personality TEXT,
    fictional_character TEXT
);