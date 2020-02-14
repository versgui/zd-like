import SpriteSheet from 'react-spritesheet';
import React from 'react';

class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posX: this.props.startx ? this.props.startx : 0,
            posY: this.props.starty ? this.props.starty : 0,
            spriteX: 0,
            spriteY: 52,
            classList: 'player',
            isDead: false,
        };

        this.spriteSheet = {
            playerBottom: {
                x: 0,
                y: 52,
            },
            playerTop: {
                x: 24,
                y: 52,
            },
            playerLeft: {
                x: 45,
                y: 52,
            },
            playerRight: {
                x: 69,
                y: 52,
            },
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleKeyDown(e) {
        if (this.state.isDead) {
            return;
        }

        const speed = 6;

        let newPosX = this.state.posX;
        let newPosY = this.state.posY;
        let sprite = 'playerBottom';

        if (e.key === 'ArrowUp') {
            newPosY -= speed;
            sprite = 'playerTop';
        } else if (e.key === 'ArrowDown') {
            newPosY += speed;
            sprite = 'playerBottom';
        } else if (e.key === 'ArrowLeft') {
            newPosX -= speed;
            sprite = 'playerLeft';
        } else if (e.key === 'ArrowRight') {
            newPosX += speed;
            sprite = 'playerRight';
        }

        let posXtile = parseInt(newPosX / 16);
        let posYtile = parseInt(newPosY / 16);

        // oops, we reached a vertical border of the map, stop here
        if (posYtile >= this.props.mapTiles.length || posYtile <= 0) {
            return;
        }
        // re-oops, we reached an horizontal border
        if (posXtile >= this.props.mapTiles[posYtile].length || posXtile <= 0) {
            return;
        }

        let newTile = this.props.mapTiles[posYtile].charAt(posXtile);

        if (newTile === '+') { // bush
            return;
        } else if (newTile === '$') { // diamond
            this.props.catchDiamond();
        } else if (newTile === 'x') { // mud
            this.props.hurt();
        } else if (newTile === 'E') { // exit
            this.props.exit();
        }

        this.setState({
            posX: newPosX,
            posY: newPosY,
            spriteX: this.spriteSheet[sprite].x,
            spriteY: this.spriteSheet[sprite].y,
        });
    }

    kill() {
        this.setState({
            classList: 'player dead',
            isDead: true,
        });
    }

    render() {
        let playerPosition = {
            left: (this.state.posX - 5) + 'px',
            top: (this.state.posY - 10) + 'px',
        };

        return (<div
            className={this.state.classList}
            style={playerPosition}
            onKeyDown={this.handleKeyDown}
            tabIndex="0">
            <SpriteSheet.Sprite filename="sprite.png"
                                x={this.state.spriteX}
                                y={this.state.spriteY}
                                width={22}
                                height={22}/>
        </div>);
    }
}

export default Player;
