import { nanoid } from 'nanoid'
import { URLSearchParams } from 'url'
import axios from 'axios'

import {
    REDIRECT_URI,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_CLIENT_ID,
    AUTHORIZE_ENDPOINT,
    TOKEN_ENDPOINT
} from './auth.constants.mjs'

let authData = null
let state = null

const authController = {}

authController.login = (req, res) => {
    state = nanoid()
    const scope = 'user-read-recently-played user-top-read'

    res.redirect(`${AUTHORIZE_ENDPOINT}?${new URLSearchParams({
        response_type: 'code',
        client_id: SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: state
    })}`)
}

authController.authCallback = async (req, res) => {
    if (req.query['error'] || req.query['state'] !== state) {
        res.redirect('/#' + new URLSearchParams({ error: 'state_mismatch' }))
    }
    else {
        state = null

        const data = new URLSearchParams({
            'grant_type': 'authorization_code',
            'code': req.query['code'],
            'redirect_uri': REDIRECT_URI
        })

        const authBuffer = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
        const authBase64 = `Basic ${authBuffer.toString('base64')}`

        const config = {
            headers: {
                'Authorization': authBase64,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        try {
            const res = await axios
                .post(TOKEN_ENDPOINT, data, config)
            authData = res.data
        } catch (error) {
            console.error(error)
        }

    }
}

export default authController
