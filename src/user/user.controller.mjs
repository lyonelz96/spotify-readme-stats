import spotifyModel from '../spotify/spotify.model.mjs'
import svgHelpers from '../svg/svg.helpers.mjs'

const userController = {}

userController.recentlyPlayed = async (req, res) => {
    const recentlyPlayed = await spotifyModel.getRecentlyPlayedTracks()

    let mediaObjs = ''

    for (const item of recentlyPlayed) {
        const song = item.track.name
        const artist = item.track.artists[0].name
        const coverURL = item.track.album.images[0].url

        mediaObjs += svgHelpers.genMediaObject(coverURL, null, song, artist)
    }

    const mediaHeader = svgHelpers.genMediaHeader('Recently Played')
    const svg = svgHelpers.genSVG(mediaHeader, mediaObjs)

    res.type('svg').send(svg)
}

userController.topItems = async (req, res) => {
    res.send(await spotifyModel.getTopItems(req.params.type))
}

export default userController
