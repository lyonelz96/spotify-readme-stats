DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS svgs;
DROP TABLE IF EXISTS svg_types;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    spotify_id UNIQUE TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
);

CREATE TABLE svgs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users ON DELETE CASCADE,
    svg_type_id INTEGER REFERENCES svg_types,
);

CREATE TABLE svg_types (
    id SERIAL PRIMARY KEY,
    svg_type TEXT,
);

INSERT INTO svg_types VALUES ("TopTracks")
INSERT INTO svg_types VALUES ("TopArtists")
INSERT INTO svg_types VALUES ("RecentlyPlayed")
