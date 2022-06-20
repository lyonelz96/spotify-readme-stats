import pg from 'pg'
import {
    PG_USER,
    PG_PASSWORD,
    PG_HOST,
    PG_PORT
} from './db.constants.mjs'

const connectionString = `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}`

const pool = new pg.Pool({ connectionString })

const db = {}

db.query = (sql, params) => pool.query(sql, params)

export default db
