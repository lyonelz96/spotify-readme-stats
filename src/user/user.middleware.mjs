import userModel from './user.model.mjs'

const userMiddleware = {}

userMiddleware.checkIfUserExistsInDB = async (req, res, next) => {
    const spotify_id = req.params.spotify_id

    const user = await userModel.find(spotify_id)

    if (user) {
        next()
    } else {
        res.send('User not found!')
    }
}

userMiddleware.checkIfUserIsTheSameAsSession = (req, res, next) => {
    if (req.session.user) {
        const spotify_id = req.params.spotify_id
        const session_spotify_id = req.session.user.spotify_id

        if (spotify_id === session_spotify_id) {
            req.userSameAsSession = true
        }
    }
    next()
}

userMiddleware.setCacheControlHeader = (req, res, next) => {
    res.header('Cache-Control', 'no-cache')
    next()
}

export default userMiddleware
