import 'dotenv/config'

import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import { session } from './db/db.session.mjs'

import { authRouter } from './auth/auth.routes.mjs'
import { userRouter } from './user/user.routes.mjs'

const app = express()
const port = process.env.PORT || 3000

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
}
app.use(session)

app.use(authRouter)
app.use(userRouter)

app.get('/', (req, res) => {
    if (req.session.user) {
        res.json({
            spotify_username: req.session.user.spotify_display_name,
            spotify_id: req.session.user.spotify_id,
        })
    } else {
        res.json({
            message: 'No user in session found',
        })
    }
})

app.get('/#', (req, res) => {
    res.send('Oops something went wrong!')
})

app.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/')
    } else {
        res.redirect('/auth/login')
    }
})

app.listen(port, () => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`Listening on ${port}`)
    }
})
