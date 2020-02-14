import React, {Component} from "react";

class SplashScreen extends Component {
    render() {
        return (
            <div className={this.props.className}>
                <img src="almost-zelda.png" alt="Almost Zelda"/>
                <div className="buttons">
                    <button type="button" onClick={this.props.game.start}>Start</button>
                    <button type="button" onClick={this.props.game.showScores}>Scores</button>
                </div>
            </div>
        );
    }
}

export default SplashScreen;
