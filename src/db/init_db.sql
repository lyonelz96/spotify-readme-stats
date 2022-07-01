DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS svgs;
DROP TABLE IF EXISTS svg_types;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    spotify_id TEXT UNIQUE NOT NULL,
    refresh_token TEXT NOT NULL
);

CREATE TABLE svg_types (
    id SERIAL PRIMARY KEY,
    svg_type TEXT NOT NULL
);

CREATE TABLE svgs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users ON DELETE CASCADE,
    svg_type_id INTEGER REFERENCES svg_types
);


INSERT INTO svg_types VALUES (DEFAULT, 'TopTracks');
INSERT INTO svg_types VALUES (DEFAULT, 'TopArtists');
INSERT INTO svg_types VALUES (DEFAULT, 'RecentlyPlayed');
