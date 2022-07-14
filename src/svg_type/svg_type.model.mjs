import db from '../db/index.mjs'

export const svgTypeModel = {}

svgTypeModel.getTypeID = async (type) => {
    try {
        return (
            await db.query('SELECT id FROM svg_types WHERE svg_type = $1', [
                type,
            ])
        ).rows[0].id
    } catch (error) {
        console.error(error)
    }
}
