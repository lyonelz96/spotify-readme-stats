import pg from 'pg'
import { DABATASE_URL } from './db.constants.mjs'

const db = {}

const config = {
    connectionString: DABATASE_URL
}

if (process.env.NODE_ENV === 'production') {
    config.ssl = {
        rejectUnauthorized: false
    }
}

db.pool = new pg.Pool(config)

db.query = (sql, params) => db.pool.query(sql, params)

export default db
