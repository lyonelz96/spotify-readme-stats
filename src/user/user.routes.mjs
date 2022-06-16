import express from "express"
import userController from './user.controller.mjs'

const userRouter = express.Router()

userRouter.get('/user/recently-played', userController.recentlyPlayed)
userRouter.get('/user/top-items/:type', userController.topItems)

export default userRouter
