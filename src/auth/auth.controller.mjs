import { nanoid } from 'nanoid'
import { URLSearchParams } from 'url'
import axios from 'axios'

import {
    REDIRECT_URI,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_CLIENT_ID,
    AUTHORIZE_ENDPOINT,
    TOKEN_ENDPOINT,
} from './auth.constants.mjs'

import { userModel } from '../user/user.model.mjs'
import { spotifyModel } from '../spotify/spotify.model.mjs'

let state = null

export const authController = {}

authController.login = (req, res) => {
    state = nanoid()
    const scope = 'user-read-recently-played user-top-read user-read-private'

    res.redirect(
        `${AUTHORIZE_ENDPOINT}?${new URLSearchParams({
            response_type: 'code',
            client_id: SPOTIFY_CLIENT_ID,
            scope: scope,
            redirect_uri: REDIRECT_URI,
            state: state,
        })}`
    )
}

authController.authCallback = async (req, res) => {
    if (req.query['error'] || req.query['state'] !== state) {
        res.redirect('/#' + new URLSearchParams({ error: 'state_mismatch' }))
    } else {
        state = null

        const data = new URLSearchParams({
            grant_type: 'authorization_code',
            code: req.query['code'],
            redirect_uri: REDIRECT_URI,
        })

        const authBuffer = Buffer.from(
            `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
        )
        const authBase64 = `Basic ${authBuffer.toString('base64')}`

        const config = {
            headers: {
                Authorization: authBase64,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }

        try {
            const authRes = await axios.post(TOKEN_ENDPOINT, data, config)

            const authData = authRes.data

            const user = await spotifyModel.getUserProfile(
                authData.access_token
            )

            if (await userModel.find(user.id)) {
                await userModel.updateRefreshToken(
                    user.id,
                    authData.refresh_token
                )
            } else {
                await userModel.create(user.id, authData.refresh_token)
            }

            const now = new Date()

            req.session.user = {
                spotify_id: user.id,
                spotify_display_name: user.display_name,
                access_token: authData.access_token,
                // Represented in ms since EPOCH
                token_expire_date: now.setMinutes(now.getMinutes() + 50), // 50 minutes from now
            }

            res.redirect('/')
        } catch (error) {
            console.error(error)
        }
    }
}
