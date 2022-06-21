import 'dotenv/config'

import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import { session } from './db/db.session.mjs'

import authRoutes from './auth/auth.routes.mjs'
import userRoutes from './user/user.routes.mjs'

import { absPathToFile } from './utils/index.mjs'

const app = express()
const port = 3000

app.use(express.static('public'))

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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
    }
    else {
        res.sendFile(absPathToFile('./login.html'))
    }
})

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})
