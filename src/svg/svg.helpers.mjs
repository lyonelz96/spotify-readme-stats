/* eslint indent: "off" */
import { spotifyModel } from '../spotify/spotify.model.mjs'
import { SVG_TYPES } from '../svg_type/svg_type.constants.mjs'
import { escapeXMLChars } from '../utils/index.mjs'

const genSVGMediaObjsRecentlyPlayed = async (access_token) => {
    const recentlyPlayed = await spotifyModel.getRecentlyPlayedTracks(
        access_token
    )

    let mediaObjs = ''

    for (const item of recentlyPlayed) {
        const coverURL = item.track.album.images[0].url
        const song = item.track.name
        const artist = item.track.artists[0].name

        mediaObjs += await svgHelpers.genMediaObject(coverURL, song, artist)
    }

    return mediaObjs
}

const genSVGMediaObjsTopTracks = async (access_token) => {
    const topTracks = await spotifyModel.getTopItems('tracks', access_token)

    let mediaObjs = ''

    for (const item of topTracks) {
        const coverURL = item.album.images[0].url
        const track = item.name
        const artist = item.artists[0].name

        mediaObjs += await svgHelpers.genMediaObject(coverURL, track, artist)
    }

    return mediaObjs
}

const genSVGMediaObjsTopArtists = async (access_token) => {
    const topArtists = await spotifyModel.getTopItems('artists', access_token)

    let mediaObjs = ''

    for (const item of topArtists) {
        const coverURL = item.images[0].url
        const artist = item.name

        mediaObjs += await svgHelpers.genMediaObject(coverURL, artist, null)
    }
    return mediaObjs
}

export const svgHelpers = {}

svgHelpers.genStyle = () => {
    return `
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        .container {
            width: 100%;
            height: 100%;
        }

        .fancy-hr {
            width: 100%;
            border: 0;
            height: 2px;
            background-image: linear-gradient(to right, transparent, #938AA9, transparent);

            margin: 0.2rem 0rem;
        }

        h1,
        h2,
        h3 {
            color: #DCD7BA;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        h1 {
            font-size: 1.2rem;
        }

        h2 {
            font-size: 1.0rem;
        }

        h3 {
            font-size: 0.8rem;
        }

        .spotify-logo,
        .cover {
            width: 32px;
            height: 32px;
        }

        .container {
            background-color: #1F1F28;
            border-radius: 10px;

            display: flex;
            flex-direction: column;
        }

        .container-header-item {
            display: flex;
            flex-direction: row;
            align-items: center;

            margin: 0.3rem 0rem;
        }

        .container-media-item {
            display: flex;
            flex-direction: row;
            align-items: center;

            flex-grow: 1;
        }

        .container-media-item,
        .container-header-item {
            margin-left: 0.8rem;
        }

        .container-header-title,
        .container-media-headings {
            margin: 0rem 0.5rem;
        }

        .container-media-headings>* {
            margin: 0.2rem 0rem;
        }
    </style>
    `
}

import { localBase64Img, webBase64Img } from '../utils/index.mjs'

svgHelpers.genMediaHeader = (title) => {
    return `
            <div class="container-header-item">
                <img src="${localBase64Img(
                    'assets/images/spotify-logo.png'
                )}" alt="Spotify Logo" class="spotify-logo" />
                <h1 class="container-header-title">${title}</h1>
            </div>

            <hr class="fancy-hr" />
    `
}
svgHelpers.genMediaObject = async (coverURL, heading, subHeading) => {
    const escapedHeading = escapeXMLChars(heading)
    const escapedSubHeading = subHeading
        ? `<h3>${escapeXMLChars(subHeading)}</h3>`
        : ''

    return `
            <div class="container-media-item">
                <img src="${await webBase64Img(
                    coverURL
                )}" alt="Cover" class="cover" />
                <div class="container-media-headings">
                    <h2>${escapedHeading}</h2>
                    ${escapedSubHeading}
                </div>
            </div>
    `
}

svgHelpers.genSVGMediaObjsByType = async (type, access_token) => {
    if (type === SVG_TYPES.RecentlyPlayed) {
        return await genSVGMediaObjsRecentlyPlayed(access_token)
    }

    if (type === SVG_TYPES.TopTracks) {
        return await genSVGMediaObjsTopTracks(access_token)
    }

    if (type === SVG_TYPES.TopArtists) {
        return await genSVGMediaObjsTopArtists(access_token)
    }
}

svgHelpers.genSVG = (mediaHeader, mediaObjs) => {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 325 350" width="325" height="350">
            <foreignObject width="100%" height="100%">
                <div class="container" xmlns="http://www.w3.org/1999/xhtml">
                    ${svgHelpers.genStyle()}
                    ${mediaHeader}
                    ${mediaObjs}
                </div>
            </foreignObject>
        </svg>
    `
}
