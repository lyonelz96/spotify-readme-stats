import { userModel } from './user.model.mjs'
import { spotifyModel } from '../spotify/spotify.model.mjs'

export const userUtils = {}

userUtils.updateAccessToken = async (req) => {
    const refresh_token = (await userModel.find(req.session.user.spotify_id))
        .refresh_token
    req.session.user.access_token = await spotifyModel.getNewAccessToken(
        refresh_token
    )
    req.session.user.token_expire_date = Date.now() + 50 * 60 * 1000 // 50 Minutes
}
