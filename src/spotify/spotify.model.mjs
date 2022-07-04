import axios from "axios"

import { SPOTIFY_API_BASE_URI } from './spotify.constants.mjs'

const spotifyModel = {}

spotifyModel.getRecentlyPlayedTracks = async (access_token) => {
    const path = '/me/player/recently-played'
    const url = `${SPOTIFY_API_BASE_URI}${path}`
    const config = {
        headers: {
            'Authorization': `Bearer ${access_token}`,
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

spotifyModel.getTopItems = async (type, access_token) => {
    const path = `/me/top/${type}`
    const url = `${SPOTIFY_API_BASE_URI}${path}`
    const config = {
        headers: {
            'Authorization': `Bearer ${access_token}`,
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

spotifyModel.getUserProfile = async (access_token) => {
    const path = '/me'
    const url = `${SPOTIFY_API_BASE_URI}${path}`
    const config = {
        headers: {
            'Authorization': `Bearer ${access_token}`,
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

export default spotifyModel
