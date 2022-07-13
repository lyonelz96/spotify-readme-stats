import userMiddleware from './user.middleware.mjs'
import { userModel } from './user.model.mjs'

import { jest, beforeEach, describe, it, expect } from '@jest/globals'

jest.mock('./user.model.mjs')

const next = jest.fn()

beforeEach(() => {
    next.mockReset()
})

describe('check if user exists in db', () => {
    const checkIfUserExistsInDB = userMiddleware.checkIfUserExistsInDB
    const req = {
        params: {
            spotify_id: true,
        },
    }
    const res = {
        send: jest.fn(),
    }

    describe('if user does not exist', () => {
        it('should call res.send', async () => {
            userModel.find.mockResolvedValue(undefined)
            await checkIfUserExistsInDB(req, res, next)

            expect(res.send.mock.calls.length).toBe(1)
        })
    })

    describe('if user exists', () => {
        it('should call next', async () => {
            userModel.find.mockResolvedValue({ user: true })
            await checkIfUserExistsInDB(req, res, next)

            expect(next.mock.calls.length).toBe(1)
        })
    })
})

describe('check if the user is the same as the session user', () => {
    const checkIfUserIsTheSameAsSession =
        userMiddleware.checkIfUserIsTheSameAsSession

    describe('if user session does not exist', () => {
        const req = {
            session: {
                user: false,
            },
        }

        it('it should call next', () => {
            checkIfUserIsTheSameAsSession(req, {}, next)
            expect(next.mock.calls.length).toBe(1)
        })
    })

    describe('if user session exists', () => {
        describe('if user session is the same as user requesting', () => {
            const req = {
                params: {
                    spotify_id: 1,
                },
                session: {
                    user: {
                        spotify_id: 1,
                    },
                },
            }

            it('should set req.userSameAsSession to true', () => {
                checkIfUserIsTheSameAsSession(req, {}, next)

                expect(req.userSameAsSession).toBe(true)
            })
        })

        describe('if user session is not the same as user requesting', () => {
            const req = {
                params: {
                    spotify_id: 1,
                },
                session: {
                    user: {
                        spotify_id: 2,
                    },
                },
            }

            it('should call next', () => {
                checkIfUserIsTheSameAsSession(req, {}, next)

                expect(next.mock.calls.length).toBe(1)
            })
        })
    })
})

describe('set cache-control header', () => {
    const setCacheControlHeader = userMiddleware.setCacheControlHeader

    const res = {
        header: jest.fn(),
    }

    it('should set the cache-control header to no-cache', () => {
        setCacheControlHeader({}, res, next)
        expect(res.header.mock.calls[0][0]).toBe('Cache-Control')
        expect(res.header.mock.calls[0][1]).toBe('no-cache')
    })

    it('should call next', () => {
        setCacheControlHeader({}, res, next)
        expect(next.mock.calls.length).toBe(1)
    })
})
