import pg from 'pg'
import { DABATASE_URL } from './db.constants.mjs'

const db = {}

db.pool = new pg.Pool({
    connectionString: DABATASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

db.query = (sql, params) => db.pool.query(sql, params)

export default db
