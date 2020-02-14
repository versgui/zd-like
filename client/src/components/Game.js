import React, {Component} from 'react';
import Map from "../Map";
import MapCanvas from "./MapCanvas";
import Player from "./Player";
import ScoreTable from "./ScoreTable";
import SplashScreen from "./SplashScreen";
import Axios from "axios";
import querystring from "querystring";

/**
 * This component manages the whole in-game interface and embbed several components: menus, the game itself, modals...
 */
class Game extends Component {

    constructor(props) {
        super(props);

        this.endpoint = 'https://g62bjw7ko8.execute-api.eu-west-3.amazonaws.com/production/score';

        const mapObj = new Map();
        this.map = mapObj.map;

        this.scoreRef = React.createRef();
        this.gameRef = React.createRef();
        this.hurtRef = React.createRef();
        this.modalRef = React.createRef();
        this.playerRef = React.createRef();
        this.diamondRef = React.createRef();

        this.state = {
            diamond: '',
            mapUnlocked: false,
            modalText: '',
            modalCta: '',
            currentScreen: 'splash',
        };

        this.start = this.start.bind(this);
        this.catchDiamond = this.catchDiamond.bind(this);
        this.exit = this.exit.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.hurt = this.hurt.bind(this);
        this.gameOver = this.gameOver.bind(this);
        this.showScores = this.showScores.bind(this);
        this.sendScore = this.sendScore.bind(this);
    }

    /**
     * Start the game.
     */
    start() {
        this.setState({
            currentScreen: 'game'
        });

        this.showModal('It\'s dangerous to go alone!', 'OK Boomer', this.hideModal);
    }

    /**
     * Show the scores screen.
     */
    showScores() {
        this.setState({
            currentScreen: 'scores'
        });
    }

    /**
     * Send the score to the API endpoint.
     *
     * @param time {string}
     */
    sendScore(time) {
        Axios.post(this.endpoint, {time: this.props.chrono.current.getCurrentTime()})
            .catch(function (error) {
                new Error(error);
            });
    }

    /**
     * Show the in-game modal.
     *
     * @param modalText Text to display in the modal
     * @param modalCta Text for the button in the modal
     * @param callback Function to call on click on the button in the modal
     */
    showModal(modalText, modalCta, callback) {
        this.setState({
            'modalText': modalText,
            'modalCta': modalCta
        });

        let modal = this.modalRef.current;
        modal.classList.remove('hidden');

        let buttonElt = modal.querySelector('button');
        buttonElt.focus();
        buttonElt.addEventListener('click', callback);

        this.props.chrono.current.stop();
    }

    /**
     * Hide the in-game modal.
     */
    hideModal() {
        this.modalRef.current.classList.add('hidden');

        setInterval(() => {
            document.querySelector('.player').focus();
        }, 500);

        this.props.chrono.current.start();
    }

    /**
     * Callback method, to call when the user catch the diamond and unlock the map.
     */
    catchDiamond() {
        this.setState({
            diamond: '',
            mapUnlocked: true,
        });
    }

    /**
     * Callback method, to call when the user reaches the end of the map.
     */
    exit() {
        if (!this.state.mapUnlocked) {
            return;
        }

        this.showModal(
            'Congratulations, you saved the diamond! You completed this map in ' + this.props.chrono.current.getCurrentTime() + '.',
            'Send the score',
            this.sendScore
        );
    }

    /**
     * Callback method, to call when the user is hurted.
     * One life will be removed, and game over is throwed if necessary.
     */
    hurt() {
        let hurtElt = this.hurtRef.current;

        hurtElt.classList.add('show');
        setTimeout(() => {
            hurtElt.classList.remove('show');
        }, 300);

        let nbLifes = this.props.life.current.removeLife();

        if (nbLifes <= 0) {
            this.gameOver();
        }
    }

    /**
     * Callback method, to call when game is over.
     */
    gameOver() {
        this.playerRef.current.kill();

        setTimeout(() => {
            this.showModal('Game over, the terrible mud got your shoes dirty.', 'Start again', this.resetGame);
        }, 1000);
    }

    /**
     * Reset completely the game.
     */
    resetGame() {
        window.location.reload(); // We could do better
    }

    render() {
        const gameStyle = {
            width: this.props.width + 'px',
            height: this.props.height + 'px',
        };

        return (
            <div className={this.props.className}>
                <SplashScreen game={this}
                              className={this.state.currentScreen === 'splash' ? 'splash' : 'splash hidden'}/>
                <ScoreTable className={this.state.currentScreen === 'scores' ? 'scores' : 'scores hidden'}
                            ref={this.scoreRef}
                            game={this}
                            endpoint={this.endpoint}/>

                <div className={this.state.currentScreen === 'game' ? 'canvas' : 'canvas hidden'} style={gameStyle}>

                    <div className="modal" ref={this.modalRef}>
                        <span>{this.state.modalText}</span>
                        <button type="button" className="small">{this.state.modalCta}</button>
                    </div>
                    <div className="hurt" ref={this.hurtRef}/>
                    <MapCanvas width="640" height="478" ref={this.gameRef} game={this} map={this.map}/>
                    <Player startx={this.map.startPosition.x * this.map.tileSize.w}
                            starty={this.map.startPosition.y * this.map.tileSize.h}
                            mapTiles={this.map.tiles}
                            exit={this.exit}
                            hurt={this.hurt}
                            catchDiamond={this.catchDiamond}
                            ref={this.playerRef}
                    />
                    {this.state.diamond}
                </div>
            </div>
        );
    }
}

export default Game;
