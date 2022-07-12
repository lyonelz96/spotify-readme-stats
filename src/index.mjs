import 'dotenv/config'

import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import { session } from './db/db.session.mjs'

import authRoutes from './auth/auth.routes.mjs'
import userRoutes from './user/user.routes.mjs'

import { filePathRelativeToCWD } from './utils/index.mjs'

const app = express()
const port = process.env.PORT || 3000

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
}
app.use(session)

app.use(authRoutes)
app.use(userRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/#', (req, res) => {
    res.send('Oops something went wrong!')
})

app.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/')
    } else {
        res.sendFile(filePathRelativeToCWD('src/login.html'))
    }
})

app.listen(port, () => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`Listening on ${port}`)
    }
})
