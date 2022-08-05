import express from 'express'
import rateLimit from 'express-rate-limit'
import { authController } from './auth.controller.mjs'

export const authRouter = express.Router()

const authLimiter = rateLimit({
    windowMs: 1000 * 60 * 60, // 1 hour
    max: 3,
    message: 'Tried to authorize too many times. Try again in 1 hour.',
    standardHeaders: true,
    legacyHeaders: false,
})

authRouter.get('/auth/authorize', authLimiter, authController.authorize)
authRouter.get('/auth/callback', authController.authCallback)
