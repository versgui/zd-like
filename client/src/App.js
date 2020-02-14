import './css/app.css';

import React, {Component} from 'react';
import Chrono from "./components/Chrono";
import Game from './components/Game';
import Life from "./components/Life";

class App extends Component {

    constructor(props) {
        super(props);

        this.chronoRef = React.createRef();
        this.gameRef = React.createRef();
        this.lifeRef = React.createRef();
    }

    render() {
        return (
            <div id="app">
                <header>
                    <Chrono ref={this.chronoRef}/>
                    <Life nbLives={3} ref={this.lifeRef}/>
                </header>

                <Game width="640"
                      height="478"
                      ref={this.gameRef}
                      className="game"
                      chrono={this.chronoRef}
                      life={this.lifeRef}/>
            </div>
        );
    }
}

export default App;
