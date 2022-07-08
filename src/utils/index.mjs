import { resolve } from 'path'

export const filePathRelativeToCWD = (relPathToFile) => {
    return resolve(process.cwd(), relPathToFile)
}

import axios from 'axios'
import { extname } from 'path'
import { readFileSync } from 'fs'

export const webBase64Img = async (url) => {
    const image = await axios.get(url, { responseType: 'arraybuffer' });
    const raw = Buffer.from(image.data).toString('base64');
    const base64Image = 'data:' + image.headers['content-type'] + ';base64,' + raw;

    return base64Image
}

export const localBase64Img = (img) => {
    const path = filePathRelativeToCWD(img)
    const type = extname(path).slice(1)
    const base64Image = 'data:image/' + type + ';base64,' + readFileSync(path, 'base64')

    return base64Image
}
