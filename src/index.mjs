import 'dotenv/config'

import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

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

app.use(authRouter)
app.use(userRouter)

app.listen(port, () => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`Listening on ${port}`)
    }
})
