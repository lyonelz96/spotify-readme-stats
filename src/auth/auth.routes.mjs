import express from 'express'
import { authController } from './auth.controller.mjs'

export const authRouter = express.Router()

// NOTE
// Rate-Limit? Don't want people spamming Spotify
// Could also use a cookie

authRouter.get('/auth/authorize', authController.authorize)
authRouter.get('/auth/callback', authController.authCallback)
