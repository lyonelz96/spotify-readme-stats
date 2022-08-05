const PG_USER = process.env.PG_USER
const PG_PASSWORD = process.env.PG_PASSWORD
const PG_HOST = process.env.PG_HOST
const PG_PORT = process.env.PG_PORT

export const DABATASE_URL =
    process.env.DATABASE_URL ||
    `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}`
