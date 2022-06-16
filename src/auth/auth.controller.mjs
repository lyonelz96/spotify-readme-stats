import { nanoid } from 'nanoid'
import { URLSearchParams } from 'url'
import axios from 'axios'

const redirect_uri = 'http://localhost:3000/auth/callback'

let authData = null
let state = null

const authController = {}

authController.authCallback = async (req, res) => {
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
}

authController.login = (req, res) => {
    state = nanoid()
    const scope = 'user-read-recently-played user-top-read'

    res.redirect(`https://accounts.spotify.com/authorize?${new URLSearchParams({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    })}`)
}

export default authController
