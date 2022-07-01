import axios from "axios"
import db from '../db/index.mjs'

import { SPOTIFY_API_BASE_URI } from './user.constants.mjs'

const userModel = {}

userModel.getRecentlyPlayedTracks = async () => {
    const path = '/me/player/recently-played'
    const url = `${SPOTIFY_API_BASE_URI}${path}`
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

userModel.getTopItems = async (type) => {
    const path = `/me/top/${type}`
    const url = `${SPOTIFY_API_BASE_URI}${path}`
    const config = {
        headers: {
            'Authorization': `Bearer ${authData.access_token}`,
            'Content-Type': 'application/json'
        },
        params: {
            'limit': 5,
            'time_range': 'short_term' // 4 weeks
        }
    }

    try {
        const res = await axios.get(url, config)
        return res.data
    } catch (error) {
        console.error(error)
    }
}

userModel.getUserProfile = async (authData) => {
    const path = '/me'
    const url = `${SPOTIFY_API_BASE_URI}${path}`
    const config = {
        headers: {
            'Authorization': `Bearer ${authData.access_token}`,
            'Content-Type': 'application/json'
        }
    }

    try {
        const res = await axios.get(url, config)
        return res.data
    } catch (error) {
        console.error(error)
    }
}

userModel.find = async (spotify_id) => {
    try {
        const { rows } = await db.query('SELECT * FROM users WHERE spotify_id = $1', [spotify_id])

        return rows.first
    } catch (error) {
        console.error(error)
    }
}

userModel.create = async (spotify_id, refresh_token) => {
    try {
        await db.query('INSERT INTO users VALUES ($1, $2)', [spotify_id, refresh_token])
    } catch (error) {
        console.error(error)
    }
}

userModel.update = async (spotify_id, update) => {
    let updateStr = 'UPDATE users SET '
    let keysOrdered = []

    Object.keys(update).forEach(key => {
        keysOrdered.push(key)
        updateStr += `${key} = $${keysOrdered.length},`
    })

    updateStr = updateStr.slice(0, -1)

    updateStr += ` WHERE spotify_id = '${spotify_id}'`

    let values = keysOrdered.map(k => update[k])

    try {
        await db.query(updateStr, values)
    } catch (error) {
        console.error(error)
    }
}

export default userModel
