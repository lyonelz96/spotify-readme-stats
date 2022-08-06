import express from 'express'
import { userController } from './user.controller.mjs'
import { userMiddleware } from './user.middleware.mjs'
import { SVG_TYPES } from '../svg_type/svg_type.constants.mjs'

export const userRouter = express.Router()

userRouter.get(
    '/user/:spotify_id',
    userMiddleware.checkIfUserExistsInDB,
    userController.index
)

userRouter.delete(
    '/user/:spotify_id/',
    userMiddleware.checkIfUserExistsInDB,
    userMiddleware.checkIfSecretMatches,
    userController.destroy
)

const svgMiddleware = [
    userMiddleware.checkIfUserExistsInDB,
    userMiddleware.setCacheControlHeader,
]

userRouter.get(
    '/user/:spotify_id/recently-played',
    svgMiddleware,
    userController.svg(SVG_TYPES.RecentlyPlayed)
)

userRouter.get(
    '/user/:spotify_id/top-tracks',
    svgMiddleware,
    userController.svg(SVG_TYPES.TopTracks)
)

userRouter.get(
    '/user/:spotify_id/top-artists',
    svgMiddleware,
    userController.svg(SVG_TYPES.TopArtists)
)
