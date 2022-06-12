import 'dotenv/config'

import { nanoid } from 'nanoid'
import { URLSearchParams } from 'url'
import axios from 'axios'

import express from 'express'
import morgan from 'morgan'

const app = express()
const port = 3000

app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

let state = null
let redirect_uri = 'http://localhost:3000/auth/callback'
app.get('/login', (req, res) => {
    state = nanoid()
    const scope = 'user-read-recently-played user-top-read'

    res.redirect('https://accounts.spotify.com/authorize?' +
        new URLSearchParams({
            response_type: 'code',
            client_id: process.env.CLIENT_ID,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }))
})

app.get('/auth/callback', async (req, res) => {
    if (req.query['error'] || req.query['state'] !== state) {
        res.redirect('/#' + new URLSearchParams({ error: 'state_mismatch' }))
    }
    else {
        state = null


        const data = new URLSearchParams({
            'grant_type': 'authorization_code',
            'code': req.query['code'],
            'redirect_uri': redirect_uri
        })

        const authBase64 = 'Basic ' +
            (new Buffer(process.env.CLIENT_ID
                + ':'
                + process.env.CLIENT_SECRET).toString('base64'))

        const config = {
            headers: {
                'Authorization': authBase64,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        try {
            const res = await axios
                .post('https://accounts.spotify.com/api/token', data, config)
        } catch (error) {
            console.error(error)
        }

    }
})

app.get('/#', (req, res) => {
    res.send('Oops something went wrong!')
})

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})
