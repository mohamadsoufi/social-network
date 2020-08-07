DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    bio VARCHAR(500),
    profile_pic VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS password_reset_codes;


CREATE TABLE password_reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR,
    code VARCHAR(6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS friendships;

CREATE TABLE friendships( id SERIAL PRIMARY KEY,
sender_id INT REFERENCES users(id) NOT NULL,
recipient_id INT REFERENCES users(id) NOT NULL,
accepted BOOLEAN DEFAULT false);

