import React from 'react';
import Diamond from "./Diamond";

/**
 * This class allows to build the map.
 */
class MapCanvas extends React.Component {

    constructor(props) {
        super(props);

        this.spriteFile = 'sprite.png';

        // Generate sprites from the sprite PNG file
        // TL: top-left, TR: top-right, M: middle, B: bottom, BR: bottom-right, ITL: internal-top-left, etc.
        this.spriteSheet = {
            bushTL: {
                x: 0,
                y: 0,
            },
            bushT: {
                x: 17,
                y: 0,
            },
            bushTR: {
                x: 35,
                y: 0,
            },
            bushML: {
                x: 0,
                y: 17,
            },
            bushM: {
                x: 17,
                y: 17,
            },
            bushMR: {
                x: 35,
                y: 17,
            },
            bushBL: {
                x: 0,
                y: 35,
            },
            bushB: {
                x: 17,
                y: 35,
            },
            bushBR: {
                x: 35,
                y: 35,
            },
            mudITL: {
                x: 85,
                y: 0,
            },
            mudITR: {
                x: 102,
                y: 0,
            },
            mudIBL: {
                x: 85,
                y: 16,
            },
            mudIBR: {
                x: 102,
                y: 18,
            },
            mudTL: {
                x: 119,
                y: 0,
            },
            mudT: {
                x: 136,
                y: 0,
            },
            mudTR: {
                x: 153,
                y: 0,
            },
            mudML: {
                x: 119,
                y: 17,
            },
            mudM: {
                x: 136,
                y: 17,
            },
            mudMR: {
                x: 153,
                y: 17,
            },
            mudBL: {
                x: 119,
                y: 35,
            },
            mudB: {
                x: 136,
                y: 35,
            },
            mudBR: {
                x: 153,
                y: 35,
            },
            diamond: {
                x: 51,
                y: 34,
            }
        };

        this.canvasRef = React.createRef();
    }

    /**
     * Load the sprite file when this component is mounted
     */
    componentDidMount() {
        this.loadImage(this.spriteFile)
            .then(spriteImg => this.buildMap(spriteImg));
    }

    /**
     * Async load of an image and return a DOM Image element.
     *
     * @param url {string}
     * @returns {Promise<Image>}
     */
    async loadImage(url) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.addEventListener('load', e => resolve(img));
            img.addEventListener('error', () => {
                reject(new Error('Failed to load image: ${url}'));
            });
            img.src = url;
        });
    }

    /**
     * Parse a string to build the map. See Map.js
     *
     * @param spriteImg {Image}
     */
    buildMap(spriteImg) {
        const map = this.props.map;
        let tile;
        let toDisplay = '';

        try {
            const tiles = map.tiles;

            // We remove -1 to width and height because we reason in index, like JS: the first value has index zero.
            const mapWidth = tiles[0].length - 1;
            const mapHeight = tiles.length - 1;

            // We build the canvas and set a background.
            const canvas = this.canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = '#928F52';
            ctx.fillRect(0, 0, this.props.width, this.props.height);

            // Let's go for the parsing of the map.
            // For each cell of the map, we check every related box and deduce the name of the sprite.
            // According to the sprite name, the corresponding sprite is displayed.
            // The names of the sprites are composed in this pattern : {kind}{T|M|B}({L|R})
            // - kind: type of cell (bush, mud...)
            // - vertical bordel: Top, Middle, Bottom. It means if we have a vertical border on one of theses sides.
            // - horizontal bordel: Left, Right. It means if we have an horizontal border on one of theses sides.

            for (let x = 0; x <= mapWidth; x++) { // for each column
                for (let y = 0; y <= mapHeight; y++) { // for each line
                    tile = tiles[y].charAt(x);
                    toDisplay = '';

                    if (tile === '+' || tile === 'x') { // bush
                        let kind = (tile === '+') ? 'bush' : 'mud';
                        toDisplay += kind;

                        if (y === 0) { // top of the canvas
                            toDisplay += 'T';
                        } else if (y === mapHeight) { // bottom of the canvas
                            toDisplay += 'B';
                        }

                        if (x === 0 || x === mapWidth) { // it's right or left side of the canvas
                            if (toDisplay === kind) { // but not on top or bottom (toDisplay is still in initial state)
                                toDisplay += 'M';
                            }

                            if (x === 0) { // left of the canvas
                                toDisplay += 'L';
                            } else if (x === mapWidth) { // right of the canas
                                toDisplay += 'R';
                            }
                        }

                        // 'toDisplay' is still in initial state, so nothing has been defined for the moment: we can
                        // go further
                        if (toDisplay === kind) {
                            if (tiles[y - 1].charAt(x) !== tile) { // top
                                toDisplay += 'T';
                            } else if (tiles[y + 1].charAt(x) !== tile) { // bottom
                                toDisplay += 'B';
                            } else {
                                toDisplay += 'M';
                            }

                            if (tiles[y].charAt(x - 1) !== tile) { // left
                                toDisplay += 'L';
                            } else if (tiles[y].charAt(x + 1) !== tile) { // right
                                toDisplay += 'R';
                            }
                        }
                    } else if (tile === '$') { // a diamond! we pass it to the Game component
                        this.props.game.setState({
                            'diamond': <Diamond
                                className="diamond"
                                ref={map.diamondRef}
                                posX={x * map.tileSize.w}
                                posY={y * map.tileSize.h}/>
                        })
                    }

                    if (toDisplay.length > 0) {
                        // there's something to display, so we fetch its coordinates in the sprite and add it on
                        // the Canvas.
                        ctx.drawImage(
                            spriteImg,
                            this.spriteSheet[toDisplay].x,
                            this.spriteSheet[toDisplay].y,
                            16,
                            16,
                            x * 16,
                            y * 16,
                            16,
                            16
                        );
                    }
                }
            }
        } catch (e) {
            new Error(e.message); // we should have a better error management 😬
        }
    }

    render() {
        return <canvas width={this.props.width} height={this.props.height} ref={this.canvasRef}/>;
    }
}

export default MapCanvas;
