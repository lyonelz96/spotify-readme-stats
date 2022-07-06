DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS svgs;
DROP TABLE IF EXISTS svg_types;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    spotify_id TEXT UNIQUE NOT NULL,
    refresh_token TEXT UNIQUE NOT NULL
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

INSERT INTO users (spotify_id, refresh_token) VALUES('spotify_id_1', 'refresh_token_1');
INSERT INTO users (spotify_id, refresh_token) VALUES('spotify_id_2', 'refresh_token_2');
INSERT INTO users (spotify_id, refresh_token) VALUES('spotify_id_3', 'refresh_token_3');

INSERT INTO svg_types (svg_type) VALUES ('TopTracks');
INSERT INTO svg_types (svg_type) VALUES ('TopArtists');
INSERT INTO svg_types (svg_type) VALUES ('RecentlyPlayed');

INSERT INTO svgs (user_id, svg_type_id, svg, request_date) VALUES(1, 1, 'svg_1_1', 123456);
INSERT INTO svgs (user_id, svg_type_id, svg, request_date) VALUES(1, 2, 'svg_1_2', 123456);
INSERT INTO svgs (user_id, svg_type_id, svg, request_date) VALUES(1, 3, 'svg_1_3', 123456);

INSERT INTO svgs (user_id, svg_type_id, svg, request_date) VALUES(2, 1, 'svg_2_1', 654321);
INSERT INTO svgs (user_id, svg_type_id, svg, request_date) VALUES(2, 2, 'svg_2_2', 654321);
INSERT INTO svgs (user_id, svg_type_id, svg, request_date) VALUES(2, 3, 'svg_2_3', 654321);

INSERT INTO svgs (user_id, svg_type_id, svg, request_date) VALUES(3, 1, 'svg_3_1', 7890);
INSERT INTO svgs (user_id, svg_type_id, svg, request_date) VALUES(3, 2, 'svg_3_2', 7890);
INSERT INTO svgs (user_id, svg_type_id, svg, request_date) VALUES(3, 3, 'svg_3_3', 7890);
