import db from '../db/index.mjs'

const userModel = {}

userModel.find = async (spotify_id) => {
    try {
        const { rows } = await db.query('SELECT * FROM users WHERE spotify_id = $1', [spotify_id])

        return rows[0]
    } catch (error) {
        console.error(error)
    }
}

userModel.create = async (spotify_id, refresh_token) => {
    try {
        await db.query('INSERT INTO users VALUES ($1, $2)', [spotify_id, refresh_token])
    } catch (error) {
        console.error(error)
    }
}

userModel.update = async (spotify_id, update) => {
    let updateStr = 'UPDATE users SET '
    let keysOrdered = []

    Object.keys(update).forEach(key => {
        keysOrdered.push(key)
        updateStr += `${key} = $${keysOrdered.length},`
    })

    updateStr = updateStr.slice(0, -1)

    updateStr += ` WHERE spotify_id = '${spotify_id}'`

    let values = keysOrdered.map(k => update[k])

    try {
        await db.query(updateStr, values)
    } catch (error) {
        console.error(error)
    }
}

userModel.svgs = async (spotify_id) => {
    try {
        const user_id = (await userModel.find(spotify_id)).id
        const svgs = (await db.query('SELECT svg, request_date, svg_type FROM svgs JOIN svg_types ON svgs.svg_type_id = svg_types.id AND user_id = $1', [user_id])).rows

        return svgs
    } catch (error) {
        console.error(error)
    }
}

userModel.svg = async (spotify_id, type) => {
    const svgs = await userModel.svgs(spotify_id)

    return svgs.find(svg => svg.svg_type === type)
}

export default userModel
