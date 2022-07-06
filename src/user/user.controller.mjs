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
            if (Date.now() > req.session.user.token_expire_date) {
                const refresh_token = (await userModel.find(req.session.user.spotify_id)).refresh_token
                req.session.user.access_token = await spotifyModel.getNewAccessToken(refresh_token)
                req.session.user.token_expire_date = Date.now() + (50 * 60 * 1000) // 50 Minutes
            }

            const recentlyPlayed = await spotifyModel.getRecentlyPlayedTracks(req.session.user.access_token)

            let mediaObjs = ''

            for (const item of recentlyPlayed) {
                const coverURL = item.track.album.images[0].url
                const song = item.track.name
                const artist = item.track.artists[0].name

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
    const type = req.params.type === 'artists' ? SVG_TYPES.TopArtists : SVG_TYPES.TopTracks

    let svgDB = await userModel.getSVG(req.params.spotify_id, type)

    if (req.userSameAsSession) {
        const requestDate = svgDB === null ? null : svgDB.request_date
        const now = svgDB === null ? null : new Date()

        const diffInDays = svgDB === null ? null : (now - requestDate) / 1000 / 60 / 60 / 24

        if (svgDB === null || diffInDays >= 30) {
            if (Date.now() > req.session.user.token_expire_date) {
                const refresh_token = (await userModel.find(req.session.user.spotify_id)).refresh_token
                req.session.user.access_token = await spotifyModel.getNewAccessToken(refresh_token)
                req.session.user.token_expire_date = Date.now() + (50 * 60 * 1000) // 50 Minutes
            }


            let mediaObjs = ''

            let mediaHeader = ''
            let svg = ''

            if (type === SVG_TYPES.TopArtists) {
                const topItems = await spotifyModel.getTopItems('artists', req.session.user.access_token)

                for (const item of topItems) {
                    const coverURL = item.images[0].url
                    const artist = item.name

                    mediaObjs += svgHelpers.genMediaObject(coverURL, artist, null)
                }
                mediaHeader = svgHelpers.genMediaHeader('Top Artists')
                svg = svgHelpers.genSVG(mediaHeader, mediaObjs)
            }
            else if (type === SVG_TYPES.TopTracks) {
                const topItems = await spotifyModel.getTopItems('tracks', req.session.user.access_token)

                for (const item of topItems) {
                    const coverURL = item.album.images[0].url
                    const track = item.name
                    const artist = item.artists[0].name

                    mediaObjs += svgHelpers.genMediaObject(coverURL, track, artist)
                }
                mediaHeader = svgHelpers.genMediaHeader('Top Tracks')
                svg = svgHelpers.genSVG(mediaHeader, mediaObjs)
            }

            if (svgDB === null) {
                await userModel.createSVG(req.session.user.spotify_id, type, svg)
            }
            else {
                await userModel.updateSVG(req.session.user.spotify_id, type, svg)
            }

            svgDB = svg
        }
    }

    res.type('svg').send(svgDB.svg ? svgDB.svg : svgDB)
}

export default userController
