import React, {Component} from 'react';

class Life extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nbLives: this.props.nbLives,
        };
    }

    render() {
        let icons = '';

        for (let i = 0; i < this.state.nbLives; i++) {
            icons += '❤';
        }

        return <div id="lives">{icons}</div>;
    }

    /**
     * Remove a life.
     *
     * @returns {number}
     */
    removeLife() {
        let currentLives = this.state.nbLives;

        // There's no more life, we stop here.
        if(currentLives <= 0) {
            return currentLives;
        }

        let newLives = currentLives - 1;

        this.setState({
            nbLives: newLives,
        });

        return newLives;
    }
}

export default Life;
