import { userModel } from './user.model.mjs'

export const userMiddleware = {}

userMiddleware.checkIfUserExistsInDB = async (req, res, next) => {
    const spotify_id = req.params.spotify_id

    const user = await userModel.find(spotify_id)

    if (user) {
        next()
    } else {
        res.send({ message: 'User not found!' })
    }
}

userMiddleware.setCacheControlHeader = (req, res, next) => {
    res.header('Cache-Control', 'no-cache')
    next()
}
