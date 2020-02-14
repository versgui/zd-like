import Map from "../Map";
import SpriteSheet from 'react-spritesheet';
import React from 'react';

class Diamond extends React.Component {
    constructor(props) {
        super(props);

        const mapObj = new Map();
        this.map = mapObj.map;
    }

    render() {
        let diamondPosition = {
            left: this.props.posX + 'px',
            top: this.props.posY + 'px',
        };

        // We use SpriteSheet.Sprite to cut the sprite file. x and y indicate the coordinates of the diamond in the
        // file, width and height indicate the size of the diamond image.
        return (
            <div className="diamond" style={diamondPosition}>
                <SpriteSheet.Sprite
                    filename="sprite.png"
                    x={51}
                    y={34}
                    width={this.map.tileSize.w}
                    height={this.map.tileSize.h}/>
            </div>
        );
    }
}

export default Diamond;
