import express from 'express'
import { userController } from './user.controller.mjs'
import { userMiddleware } from './user.middleware.mjs'

export const userRouter = express.Router()

const middleware = [
    userMiddleware.checkIfUserExistsInDB,
    userMiddleware.checkIfUserIsTheSameAsSession,
    userMiddleware.setCacheControlHeader,
]

userRouter.get(
    '/user/:spotify_id/recently-played',
    middleware,
    userController.recentlyPlayed
)
userRouter.get(
    '/user/:spotify_id/top-items/:type',
    middleware,
    userController.topItems
)
