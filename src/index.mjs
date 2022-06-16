import 'dotenv/config'

import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import authRoutes from './auth/auth.routes.mjs'
import userRoutes from './user/user.routes.mjs'

const app = express()
const port = 3000

app.use(express.static('public'))

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(authRoutes)
app.use(userRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/#', (req, res) => {
    res.send('Oops something went wrong!')
})

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})
