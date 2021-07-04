CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    password    TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE CHECK (POSITION('@' in email) > 1),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE sleeps (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    hours       INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);