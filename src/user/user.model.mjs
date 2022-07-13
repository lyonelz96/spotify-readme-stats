import { db } from '../db/index.mjs'

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

userModel.create = async (spotify_id, refresh_token) => {
    try {
        await db.query(
            'INSERT INTO users (spotify_id, refresh_token) VALUES ($1, $2)',
            [spotify_id, refresh_token]
        )
    } catch (error) {
        console.error(error)
    }
}

userModel.updateRefreshToken = async (spotify_id, refresh_token) => {
    try {
        await db.query(
            'UPDATE users SET refresh_token = $1 WHERE spotify_id = $2',
            [refresh_token, spotify_id]
        )
    } catch (error) {
        console.error(error)
    }
}

userModel.getAllSVGS = async (spotify_id) => {
    try {
        const user_id = (await userModel.find(spotify_id)).id
        const svgs = (
            await db.query(
                'SELECT svg, request_date, svg_type FROM svgs JOIN svg_types ON svgs.svg_type_id = svg_types.id AND user_id = $1',
                [user_id]
            )
        ).rows

        return svgs
    } catch (error) {
        console.error(error)
    }
}

userModel.getSVG = async (spotify_id, type) => {
    try {
        const svgs = await userModel.getAllSVGS(spotify_id)

        if (svgs.length === 0) {
            return null
        } else {
            const svg = svgs.find((svg) => svg.svg_type === type)
            return svg ? svg : null
        }
    } catch (error) {
        console.error(error)
    }
}

userModel.updateSVG = async (spotify_id, type, svg) => {
    try {
        const type_id = (
            await db.query('SELECT id FROM svg_types WHERE svg_type = $1', [
                type,
            ])
        ).rows[0].id
        const user_id = (await userModel.find(spotify_id)).id

        await db.query(
            'UPDATE svgs SET svg = $1 WHERE user_id = $2 AND svg_type_id = $3',
            [svg, user_id, type_id]
        )
    } catch (error) {
        console.error(error)
    }
}

userModel.createSVG = async (spotify_id, type, svg) => {
    try {
        const type_id = (
            await db.query('SELECT id FROM svg_types WHERE svg_type = $1', [
                type,
            ])
        ).rows[0].id
        const user_id = (await userModel.find(spotify_id)).id
        const request_date = new Date().getTime()

        await db.query(
            'INSERT INTO svgs (user_id, svg_type_id, svg, request_date) VALUES ($1, $2, $3, $4)',
            [user_id, type_id, svg, request_date]
        )
    } catch (error) {
        console.error(error)
    }
}
