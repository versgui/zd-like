import React, {Component} from 'react';

class Chrono extends Component {

    constructor(props) {
        super(props);

        this.state = {
            startTS: null,
            diff: null,
            suspended: 0,
            interval: null
        };

        this.tick = this.tick.bind(this);
    }

    /**
     * Start the chrono
     */
    start() {
        this.setState({
            startTS: +new Date() - this.state.suspended,
            interval: requestAnimationFrame(this.tick),
            suspended: 0
        });
    }

    /**
     * Stop the chrono
     */
    stop() {
        cancelAnimationFrame(this.state.interval);
        this.setState({
            startTS: null,
            suspended: +this.state.diff
        });
    }

    /**
     * Reset the chrono
     */
    reset() {
        this.stop();

        this.setState({
            interval: null,
        });
    }

    /**
     * Internal method, called to update the chrono
     */
    tick() {
        this.setState({
            diff: new Date(+new Date() - this.state.startTS),
            interval: requestAnimationFrame(this.tick)
        });
    }

    /**
     * Add a zero to an integer with 1 digit (eg: n=1 will return `01`)
     *
     * @param n The integer
     * @returns {int}
     */
    addZero(n) {
        return n < 10 ? '0' + n : n;
    }

    /**
     * Get current time as a formatted string (eg: `01:02:03`).
     *
     * @returns {string}
     */
    getCurrentTime() {
        var diff = this.state.diff;
        var hundredths = diff ? Math.round(this.state.diff.getMilliseconds() / 10) : 0;
        var seconds = diff ? this.state.diff.getSeconds() : 0;
        var minutes = diff ? this.state.diff.getMinutes() : 0;

        if (hundredths === 100) hundredths = 0;

        return this.addZero(minutes) + ':' + this.addZero(seconds) + ':' + this.addZero(hundredths);
    }

    render() {
        return (
            <p className="chrono">{this.getCurrentTime()}</p>
        );
    }
}

export default Chrono;
