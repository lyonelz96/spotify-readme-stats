import 'dotenv/config'

import axios from 'axios'

import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import authRoutes from './auth/auth.routes.mjs'

const app = express()
const port = 3000

app.use(express.static('public'))

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(authRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
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
        return res.data.items
    } catch (error) {
        console.error(error)
    }

}

app.get('/recently-played', async (req, res) => {
    const recentlyPlayed = await getRecentlyPlayedTracks()

    let mediaObjs = ''

    for (const item of recentlyPlayed) {
        const song = item.track.name
        const artist = item.track.artists[0].name
        const coverURL = item.track.album.images[0].url

        mediaObjs += genMediaObject(coverURL, null, song, artist)
    }

    const mediaHeader = genMediaHeader('Recently Played')
    const svg = genSVG(mediaHeader, mediaObjs)

    res.type('svg').send(svg)
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

const genMediaHeader = (title) => {
    return `
        <div class="container-header-item">
            <img src="/images/spotify-logo.png" alt="Spotify Logo" width="50px" height="50px"/>
            <h1>${title}</h1>
        </div>

        <hr/>
    `
}
const genMediaObject = (coverURL, album, song, artist) => {
    return `
        <div class="container-media-item">
            <img src="${coverURL}" alt="Cover" width="50px" height="50px"/>
            <div>
                <h4>${song}</h4>
                <h5>${artist}</h5>
            </div>
        </div>
    `
}

const genSVG = (mediaHeader, mediaObjs) => {
    return `
        <svg xmlns="http://www.w3.org/2000/svg">
            ${genStyle()}
            <rect />
            <foreignObject>
                <div class="container" xmlns="http://www.w3.org/1999/xhtml">
                    ${mediaHeader}
                    ${mediaObjs}
                </div>
            </foreignObject>
        </svg>
    `
}

app.get('/svg', (req, res) => {
    res.type('svg').send(genSVG())
})
