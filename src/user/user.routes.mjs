import express from 'express'
import { userController } from './user.controller.mjs'
import { userMiddleware } from './user.middleware.mjs'
import { SVG_TYPES } from '../svg_type/svg_type.constants.mjs'

export const userRouter = express.Router()

const middleware = [
    userMiddleware.checkIfUserExistsInDB,
    userMiddleware.setCacheControlHeader,
]

userRouter.get(
    '/user/:spotify_id',
    userMiddleware.checkIfUserExistsInDB,
    userController.index
)

userRouter.get(
    '/user/:spotify_id/recently-played',
    middleware,
    userController.svg(SVG_TYPES.RecentlyPlayed)
)
userRouter.get(
    '/user/:spotify_id/top-tracks',
    middleware,
    userController.svg(SVG_TYPES.TopTracks)
)
userRouter.get(
    '/user/:spotify_id/top-artists',
    middleware,
    userController.svg(SVG_TYPES.TopArtists)
)
