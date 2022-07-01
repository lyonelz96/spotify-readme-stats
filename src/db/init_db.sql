DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    refresh_token TEXT NOT NULL,
    svg_recently_played TEXT,
    svg_top_tracks TEXT,
    svg_top_artists TEXT
);
