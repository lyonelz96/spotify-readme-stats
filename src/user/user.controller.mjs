import { userModel } from './user.model.mjs'
import { userUtils } from './user.utils.mjs'
import { svgHelpers } from '../svg/svg.helpers.mjs'
import { SVG_TYPES } from '../svg_type/svg_type.constants.mjs'

export const userController = {}

userController.recentlyPlayed = async (req, res) => {
    let svgDB = await userModel.getSVG(
        req.params.spotify_id,
        SVG_TYPES.RecentlyPlayed
    )

    if (req.userSameAsSession) {
        const requestDate = svgDB === null ? null : svgDB.request_date
        const now = svgDB === null ? null : new Date()

        const diffInMins =
            svgDB === null ? null : (now - requestDate) / 1000 / 60

        if (svgDB === null || diffInMins >= 15) {
            if (Date.now() > req.session.user.token_expire_date) {
                await userUtils.updateAccessToken(req)
            }

            const mediaHeader = svgHelpers.genMediaHeader('Recently Played')
            const mediaObjs = await svgHelpers.genSVGMediaObjsByType(
                SVG_TYPES.RecentlyPlayed,
                req.session.user.access_token
            )
            const svg = svgHelpers.genSVG(mediaHeader, mediaObjs)

            if (svgDB === null) {
                await userModel.createSVG(
                    req.session.user.spotify_id,
                    SVG_TYPES.RecentlyPlayed,
                    svg
                )
            } else {
                await userModel.updateSVG(
                    req.session.user.spotify_id,
                    SVG_TYPES.RecentlyPlayed,
                    svg
                )
            }

            svgDB = svg
        }
    }

    if (svgDB === null) {
        res.send('SVG not found!')
    } else {
        res.type('svg').send(svgDB.svg ? svgDB.svg : svgDB)
    }
}

userController.topTracks = async (req, res) => {
    let svgDB = await userModel.getSVG(
        req.params.spotify_id,
        SVG_TYPES.TopTracks
    )

    if (req.userSameAsSession) {
        const requestDate = svgDB === null ? null : svgDB.request_date
        const now = svgDB === null ? null : new Date()

        const diffInDays =
            svgDB === null ? null : (now - requestDate) / 1000 / 60 / 60 / 24

        if (svgDB === null || diffInDays >= 30) {
            if (Date.now() > req.session.user.token_expire_date) {
                await userUtils.updateAccessToken(req)
            }

            const mediaHeader = svgHelpers.genMediaHeader('Top Tracks')
            const mediaObjs = await svgHelpers.genSVGMediaObjsByType(
                SVG_TYPES.TopTracks,
                req.session.user.access_token
            )
            const svg = svgHelpers.genSVG(mediaHeader, mediaObjs)

            if (svgDB === null) {
                await userModel.createSVG(
                    req.session.user.spotify_id,
                    SVG_TYPES.TopTracks,
                    svg
                )
            } else {
                await userModel.updateSVG(
                    req.session.user.spotify_id,
                    SVG_TYPES.TopTracks,
                    svg
                )
            }

            svgDB = svg
        }
    }

    if (svgDB === null) {
        res.send('SVG not found!')
    } else {
        res.type('svg').send(svgDB.svg ? svgDB.svg : svgDB)
    }
}

userController.topArtists = async (req, res) => {
    let svgDB = await userModel.getSVG(
        req.params.spotify_id,
        SVG_TYPES.TopArtists
    )

    if (req.userSameAsSession) {
        const requestDate = svgDB === null ? null : svgDB.request_date
        const now = svgDB === null ? null : new Date()

        const diffInDays =
            svgDB === null ? null : (now - requestDate) / 1000 / 60 / 60 / 24

        if (svgDB === null || diffInDays >= 30) {
            if (Date.now() > req.session.user.token_expire_date) {
                await userUtils.updateAccessToken(req)
            }

            const mediaHeader = svgHelpers.genMediaHeader('Top Artists')
            const mediaObjs = await svgHelpers.genSVGMediaObjsByType(
                SVG_TYPES.TopArtists,
                req.session.user.access_token
            )
            const svg = svgHelpers.genSVG(mediaHeader, mediaObjs)

            if (svgDB === null) {
                await userModel.createSVG(
                    req.session.user.spotify_id,
                    SVG_TYPES.TopArtists,
                    svg
                )
            } else {
                await userModel.updateSVG(
                    req.session.user.spotify_id,
                    SVG_TYPES.TopArtists,
                    svg
                )
            }

            svgDB = svg
        }
    }

    if (svgDB === null) {
        res.send('SVG not found!')
    } else {
        res.type('svg').send(svgDB.svg ? svgDB.svg : svgDB)
    }
}
