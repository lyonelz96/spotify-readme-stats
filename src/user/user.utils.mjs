import { userModel } from './user.model.mjs'
import { spotifyModel } from '../spotify/spotify.model.mjs'

export const userUtils = {}

userUtils.getNewAccessToken = async (spotify_id) => {
    const refresh_token = (await userModel.find(spotify_id)).refresh_token

    return await spotifyModel.getNewAccessToken(refresh_token)
}

userUtils.genAccessTokenExpireDate = () => {
    const now = new Date()

    // Represented in ms since EPOCH
    return now.setMinutes(now.getMinutes() + 50) // 50 minutes from now
}
