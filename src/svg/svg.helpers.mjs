const svgHelpers = {}

svgHelpers.genStyle = () => {
    return `
            <style>
            svg {
                width: 400px;
                height: 400px;
            }

            foreignObject,
            container {
                width: 100%;
                height:100%;
            }

            rect {
                rx: 10px;
                ry: 10px;
                fill: #1F1F28;
            }

            .container {
                display: flex;
                flex-direction: column;
            }

            .container-header-item {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }

            .container-header-item>img,
            .container-media-item>img {
                margin: 1rem;
            }

            .container-media-item {
                display: flex;
                flex-direction: row;
                align-items: center;

                margin-left: 2rem;
            }

            .container-media-item>h3 {
                flex-grow: 1;
                align-self: center;
            }

            hr {
                width: 100%;
                border: 0;
                height: 2px;
                background-image: linear-gradient(to right, transparent, #938AA9, transparent);
            }

            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
                color: #DCD7BA;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }
        </style>
    `
}

svgHelpers.genMediaHeader = (title) => {
    return `
        <div class="container-header-item">
            <img src="/images/spotify-logo.png" alt="Spotify Logo" width="50px" height="50px"/>
            <h1>${title}</h1>
        </div>

        <hr/>
    `
}
svgHelpers.genMediaObject = (coverURL, album, song, artist) => {
    return `
        <div class="container-media-item">
            <img src="${coverURL}" alt="Cover" width="50px" height="50px"/>
            <div>
                <h4>${song}</h4>
                <h5>${artist}</h5>
            </div>
        </div>
    `
}

svgHelpers.genSVG = (mediaHeader, mediaObjs) => {
    return `
        <svg xmlns="http://www.w3.org/2000/svg">
            ${genStyle()}
            <rect />
            <foreignObject>
                <div class="container" xmlns="http://www.w3.org/1999/xhtml">
                    ${mediaHeader}
                    ${mediaObjs}
                </div>
            </foreignObject>
        </svg>
    `
}

export default svgHelpers
