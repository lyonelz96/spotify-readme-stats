import { db } from '../db/index.mjs'
import { svgTypeModel } from '../svg_type/svg_type.model.mjs'
import { userUtils } from './user.utils.mjs'

export const userModel = {}

userModel.find = async (spotify_id) => {
    try {
        const { rows } = await db.query(
            'SELECT * FROM users WHERE spotify_id = $1',
            [spotify_id]
        )

        return rows[0]
    } catch (error) {
        console.error(error)
    }
}

userModel.create = async (spotify_id, refresh_token, access_token, secret) => {
    try {
        await db.query(
            'INSERT INTO users (spotify_id, refresh_token, access_token, access_token_expire_date, secret) VALUES ($1, $2, $3, $4, $5)',
            [
                spotify_id,
                refresh_token,
                access_token,
                userUtils.genAccessTokenExpireDate(),
                secret,
            ]
        )
    } catch (error) {
        console.error(error)
    }
}

userModel.update = async (spotify_id, refresh_token, access_token, secret) => {
    try {
        await db.query(
            'UPDATE users SET refresh_token = $1, access_token = $2, access_token_expire_date = $3, secret = $4 WHERE spotify_id = $5',
            [
                refresh_token,
                access_token,
                userUtils.genAccessTokenExpireDate(),
                secret,
                spotify_id,
            ]
        )
    } catch (error) {
        console.error(error)
    }
}

userModel.destroy = async (spotify_id, secret) => {
    try {
        await db.query(
            'DELETE FROM users WHERE spotify_id = $1 AND secret = $2',
            [spotify_id, secret]
        )
    } catch (error) {
        console.error(error)
    }
}

userModel.getUserID = async (spotify_id) => {
    try {
        return (await userModel.find(spotify_id)).id
    } catch (error) {
        console.error(error)
    }
}

userModel.updateAccessToken = async (spotify_id, access_token) => {
    try {
        await db.query(
            'UPDATE users SET access_token = $1, access_token_expire_date = $2 WHERE spotify_id = $3',
            [access_token, userUtils.genAccessTokenExpireDate(), spotify_id]
        )

        return {
            access_token: access_token,
        }
    } catch (error) {
        console.error(error)
    }
}

userModel.getSVG = async (spotify_id, type) => {
    try {
        const user_id = await userModel.getUserID(spotify_id)
        const type_id = await svgTypeModel.getTypeID(type)

        const { rows } = await db.query(
            'SELECT svg, svg_type, request_date FROM svgs INNER JOIN svg_types ON svgs.svg_type_id = svg_types.id WHERE user_id = $1 AND svg_types.id = $2',
            [user_id, type_id]
        )
        const svg = rows[0]

        return svg ? svg : null
    } catch (error) {
        console.error(error)
    }
}

userModel.updateSVG = async (spotify_id, type, svg) => {
    try {
        const user_id = await userModel.getUserID(spotify_id)
        const type_id = await svgTypeModel.getTypeID(type)
        const request_date = new Date().getTime()

        await db.query(
            'UPDATE svgs SET svg = $1, request_date = $2 WHERE user_id = $3 AND svg_type_id = $4',
            [svg, request_date, user_id, type_id]
        )
    } catch (error) {
        console.error(error)
    }
}

userModel.createSVG = async (spotify_id, type, svg) => {
    try {
        const user_id = await userModel.getUserID(spotify_id)
        const type_id = await svgTypeModel.getTypeID(type)
        const request_date = new Date().getTime()

        await db.query(
            'INSERT INTO svgs (user_id, svg_type_id, svg, request_date) VALUES ($1, $2, $3, $4)',
            [user_id, type_id, svg, request_date]
        )
    } catch (error) {
        console.error(error)
    }
}
