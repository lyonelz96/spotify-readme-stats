import { resolve } from 'path'

const __dirname = new URL('../', import.meta.url).pathname

export const absPathToFile = relPathToFile => {
    return resolve(__dirname + relPathToFile)
}
