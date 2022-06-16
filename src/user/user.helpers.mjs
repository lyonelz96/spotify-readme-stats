import axios from "axios"

const userHelpers = {}

const spotifyBaseURI = 'https://api.spotify.com/v1'

userHelpers.getRecentlyPlayedTracks = async () => {
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

userHelpers.getTopItems = async (type) => {
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

export default userHelpers
