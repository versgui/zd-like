import Axios from "axios";
import querystring from "querystring";
import React, {Component} from "react";

class ScoreTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scores: [],
        };
    }

    componentDidMount() {
        this.fetchScores()
            .then(scores => {
                this.setState({
                    scores: scores
                })
            });
    }

    async fetchScores() {
        let response = await Axios.get(this.props.endpoint);
        let scoresObject = response.data.Items;
        let scores = {};

        scoresObject.map((score) => {
            scores[score.id] = score.time;
        });

        return scores;
    }

    render() {
        var that = this;

        return (<div className={this.props.className}>
            <p>Scores :</p>
            <ul>
                {Object.keys(that.state.scores).map(function (key) {
                    return <li key={key}>{that.state.scores[key]}</li>;
                })}
            </ul>

            <button type="button" onClick={this.props.game.start}>Start</button>
        </div>);
    }
}

export default ScoreTable;
