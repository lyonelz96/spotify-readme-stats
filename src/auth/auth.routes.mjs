import express from 'express'
import authController from './auth.controller.mjs'

const authRouter = express.Router()

authRouter.get('/auth/login', authController.login)
authRouter.get('/auth/callback', authController.authCallback)

export default authRouter
