import spotifyModel from '../spotify/spotify.model.mjs'
import userModel from './user.model.mjs'
import svgHelpers from '../svg/svg.helpers.mjs'
import { SVG_TYPES } from '../svg/svg.constants.mjs'

const userController = {}

userController.recentlyPlayed = async (req, res) => {

    let svgDB = await userModel.getSVG(req.params.spotify_id, SVG_TYPES.RecentlyPlayed)

    if (req.userSameAsSession) {
        const requestDate = svgDB === null ? null : svgDB.request_date
        const now = svgDB === null ? null : new Date()

        const diffInMins = svgDB === null ? null : (now - requestDate) / 1000 / 60

        if (svgDB === null || diffInMins >= 15) {
            if (Date.now() < req.session.user.token_expire_date) {
                const refresh_token = (await userModel.find(req.session.user.spotify_id)).refresh_token
                req.session.user.access_token = await spotifyModel.getNewAccessToken(refresh_token)
                req.session.user.token_expire_date = Date.now() + (50 * 60 * 1000) // 50 Minutes
            }

            const recentlyPlayed = await spotifyModel.getRecentlyPlayedTracks(req.session.user.access_token)

            let mediaObjs = ''

            for (const item of recentlyPlayed) {
                const song = item.track.name
                const artist = item.track.artists[0].name
                const coverURL = item.track.album.images[0].url

                mediaObjs += svgHelpers.genMediaObject(coverURL, song, artist)
            }

            const mediaHeader = svgHelpers.genMediaHeader('Recently Played')
            const svg = svgHelpers.genSVG(mediaHeader, mediaObjs)

            if (svgDB === null) {
                await userModel.createSVG(req.session.user.spotify_id, SVG_TYPES.RecentlyPlayed, svg)
            }
            else {
                await userModel.updateSVG(req.session.user.spotify_id, SVG_TYPES.RecentlyPlayed, svg)
            }

            svgDB = svg
        }
    }

    res.type('svg').send(svgDB.svg ? svgDB.svg : svgDB)
}

userController.topItems = async (req, res) => {
    res.send(await spotifyModel.getTopItems(req.params.type))
}

export default userController
