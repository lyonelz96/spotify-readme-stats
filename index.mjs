import 'dotenv/config'

import { nanoid } from 'nanoid'
import { URLSearchParams } from 'url'
import axios from 'axios'

import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

const app = express()
const port = 3000

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// .__.    , .     __. ,    ._._
// [__]. .-+-|_   (__ -+-. .|,|,
// |  |(_| | [ )  .__) | (_|| | 

let state = null
let redirect_uri = 'http://localhost:3000/auth/callback'
app.get('/login', (req, res) => {
    state = nanoid()
    const scope = 'user-read-recently-played user-top-read'

    res.redirect(`https://accounts.spotify.com/authorize?${new URLSearchParams({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    })}`)
})

let authData = null
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

        const authBuffer = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`)
        const authBase64 = `Basic ${authBuffer.toString('base64')}`

        const config = {
            headers: {
                'Authorization': authBase64,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        try {
            const res = await axios
                .post('https://accounts.spotify.com/api/token', data, config)
            authData = res.data
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


//  __.       ,  ._     .__..__ ._.   __. ,    ._._
// (__ ._  _ -+-*|,  .  [__][__) |   (__ -+-. .|,|,
// .__)[_)(_) | || \_|  |  ||   _|_  .__) | (_|| | 
//     |           ._|                             

const spotifyBaseURI = 'https://api.spotify.com/v1'

const getRecentlyPlayedTracks = async () => {
    const path = '/me/player/recently-played'
    const url = `${spotifyBaseURI}${path}`
    const config = {
        headers: {
            'Authorization': `Bearer ${authData.access_token}`,
            'Content-Type': 'application/json'
        },
        params: {
            'limit': 5
        }
    }

    try {
        const res = await axios.get(url, config)
        return res.data
    } catch (error) {
        console.error(error)
    }

}

app.get('/recently-played', async (req, res) => {
    res.send(await getRecentlyPlayedTracks())
})

const getUserTopItems = async (type) => {
    const path = `/me/top/${type}`
    const url = `${spotifyBaseURI}${path}`
    const config = {
        headers: {
            'Authorization': `Bearer ${authData.access_token}`,
            'Content-Type': 'application/json'
        },
        params: {
            'limit': 5,
            'time_range': 'short_term'
        }
    }

    try {
        const res = await axios.get(url, config)
        return res.data
    } catch (error) {
        console.error(error)
    }
}

app.get('/top-items/:type', async (req, res) => {
    res.send(await getUserTopItems(req.params.type))
})

//  __..  ..__    __. ,    ._._
// (__ \  /[ __  (__ -+-. .|,|,
// .__) \/ [_./  .__) | (_|| | 

const genStyle = () => {
    return `
        <style>
            svg {
                width: 400px;
                height: 400px;
            }

            rect,
            foreignObject,
            container {
                width: 100%;
                height:100%;
            }

            rect {
                rx: 10px;
                ry: 10px;
                fill: #1F1F28;
            }

            .container {
                display: flex;
                flex-direction: column;
            }

            .container-header-item {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }

            .container-header-item>img,
            .container-media-item>img {
                margin: 1rem;
            }

            .container-media-item {
                display: flex;
                flex-direction: row;
                align-items: center;

                margin-left: 2rem;
            }

            .container-media-item>h3 {
                flex-grow: 1;
                align-self: center;
            }

            hr {
                width: 100%;
                border: 0;
                height: 2px;
                background-image: linear-gradient(to right, transparent, #938AA9, transparent);
            }

            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
                color: #DCD7BA;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }
        </style>
    `
}
const genMediaObject = () => {
    return `
    <div class="container">
        <div class="container-header-item">
            <img src="https://place-hold.it/50x50" alt="Spotify Logo">
            <h1>Title</h1>
        </div>

        <hr>

        <div class="container-media-item">
            <img src="https://place-hold.it/50x50" alt="Spotify Logo">
            <h4>album/track/artist name</h4>
        </div>
    </div>
    `
}

const genSVG = () => {
    return `
        <svg>
            ${genStyle()}
            <rect />
            <foreignObject>
                ${genMediaObject()}
            </foreignObject>
        </svg>
    `
}

app.get('/svg', (req, res) => {
    res.send(genSVG())
})
