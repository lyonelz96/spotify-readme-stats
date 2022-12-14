export const REDIRECT_URI =
    process.env.AUTH_REDIRECT_URI || 'http://localhost:3000/auth/callback'
export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
export const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
export const AUTHORIZE_ENDPOINT = 'https://accounts.spotify.com/authorize'
export const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
