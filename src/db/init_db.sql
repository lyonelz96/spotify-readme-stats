DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS svgs;
DROP TABLE IF EXISTS svg_types;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    spotify_id TEXT UNIQUE NOT NULL,
    refresh_token TEXT UNIQUE NOT NULL,
    access_token TEXT UNIQUE NOT NULL,
    access_token_expire_date BIGINT NOT NULL,
    secret TEXT UNIQUE NOT NULL
);

CREATE TABLE svg_types (
    id SERIAL PRIMARY KEY,
    svg_type TEXT UNIQUE NOT NULL
);

CREATE TABLE svgs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users ON DELETE CASCADE,
    svg_type_id INTEGER REFERENCES svg_types,
    svg TEXT NOT NULL,
    request_date BIGINT NOT NULL
);

INSERT INTO svg_types (svg_type) VALUES ('Top Tracks');
INSERT INTO svg_types (svg_type) VALUES ('Top Artists');
INSERT INTO svg_types (svg_type) VALUES ('Recently Played');
