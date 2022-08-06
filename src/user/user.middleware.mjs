import { userModel } from './user.model.mjs'

export const userMiddleware = {}

userMiddleware.checkIfUserExistsInDB = async (req, res, next) => {
    const spotify_id = req.params.spotify_id

    const user = await userModel.find(spotify_id)

    if (user) {
        next()
    } else {
        res.status(404).send({ message: 'User not found' })
    }
}

userMiddleware.checkIfSecretMatches = async (req, res, next) => {
    const spotify_id = req.params.spotify_id
    const secret = req.body.secret

    const user = await userModel.find(spotify_id)

    if (user.secret !== secret) {
        res.status(400).send({ message: 'secret does not match' })
    } else {
        next()
    }
}

userMiddleware.setCacheControlHeader = (req, res, next) => {
    res.header('Cache-Control', 'no-cache')
    next()
}
