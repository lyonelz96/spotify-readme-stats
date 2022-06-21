import expressSession from 'express-session'
import pgSession from 'connect-pg-simple'
import db from './index.mjs'

import { SESSION_SECRET } from './db.constants.mjs'

export const session = expressSession({
    store: new (pgSession(expressSession))({
        pool: db.pool,
        createTableIfMissing: true,
        pruneSessionInterval: 60 * 15 // 15 Minutes
    }),
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 Hours
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'development' ? false : true
    },
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
})
