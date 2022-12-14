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

authController.authorize = (req, res) => {
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
        res.status(400).send({ message: 'State Mismatch' })
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

            const secret = nanoid()

            if (await userModel.find(user.id)) {
                await userModel.update(
                    user.id,
                    authData.refresh_token,
                    authData.access_token,
                    secret
                )
            } else {
                await userModel.create(
                    user.id,
                    authData.refresh_token,
                    authData.access_token,
                    secret
                )
            }

            res.send({
                message: 'Make sure you save the secret for database deletion',
                secret: secret,
            })
        } catch (error) {
            console.error(error)
        }
    }
}
