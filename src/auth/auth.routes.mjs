import express from "express"
import authController from './auth.controller.mjs'

const authRouter = express.Router()

authRouter.get('/auth/callback', authController.authCallback)
authRouter.get('/login', authController.login)

export default authRouter
