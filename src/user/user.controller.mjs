import { userModel } from './user.model.mjs'
import { userUtils } from './user.utils.mjs'
import { svgHelpers } from '../svg/svg.helpers.mjs'
import { SVG_TYPES } from '../svg_type/svg_type.constants.mjs'

export const userController = {}

userController.index = (req, res) => {
    res.send({
        'Recently Played': `${req.get('Host')}/user/${
            req.params.spotify_id
        }/recently-played`,
        'Top Tracks': `${req.get('Host')}/user/${
            req.params.spotify_id
        }/top-tracks`,
        'Top Artists': `${req.get('Host')}/user/${
            req.params.spotify_id
        }/top-artists`,
    })
}

userController.svg = (svg_type) => async (req, res) => {
    let svgDB = await userModel.getSVG(req.params.spotify_id, svg_type)

    const requestDate = svgDB === null ? null : svgDB.request_date
    const now = svgDB === null ? null : new Date()
    const diffInMins = svgDB === null ? null : (now - requestDate) / 1000 / 60

    let isUpdateable = null

    if (svg_type === SVG_TYPES.RecentlyPlayed) {
        isUpdateable = diffInMins >= 15 ? true : false // 15 Mins
    } else {
        isUpdateable = diffInMins >= 60 * 24 ? true : false // 24 Hours
    }

    if (svgDB === null || isUpdateable) {
        const user = await userModel.find(req.params.spotify_id)

        if (Date.now() > user.access_token_expire_date) {
            const { access_token } = await userModel.updateAccessToken(
                user.spotify_id,
                await userUtils.getNewAccessToken(user.spotify_id)
            )
            user.access_token = access_token
        }

        const mediaHeader = svgHelpers.genMediaHeader(svg_type)
        const mediaObjs = await svgHelpers.genSVGMediaObjsByType(
            svg_type,
            user.access_token
        )
        const svg = svgHelpers.genSVG(mediaHeader, mediaObjs)

        if (svgDB === null) {
            await userModel.createSVG(user.spotify_id, svg_type, svg)
        } else {
            await userModel.updateSVG(user.spotify_id, svg_type, svg)
        }

        svgDB = svg
    }

    if (svgDB === null) {
        res.status(404).send('SVG not found!')
    } else {
        res.type('svg').send(svgDB.svg ? svgDB.svg : svgDB)
    }
}
