import React from "react";
import Alert from "react-s-alert";
import Chart from "./Chart";

// mandatory
import "react-s-alert/dist/s-alert-default.css";

// optional - you can choose the effect you want
import "react-s-alert/dist/s-alert-css-effects/slide.css";
// import 'react-s-alert/dist/s-alert-css-effects/scale.css';
// import 'react-s-alert/dist/s-alert-css-effects/bouncyflip.css';
// import 'react-s-alert/dist/s-alert-css-effects/flip.css';
// import 'react-s-alert/dist/s-alert-css-effects/genie.css';
// import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
// import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleResize = this.handleResize.bind(this);

        this.state = { chartWidth: window.innerWidth };
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize() {
        this.handleAlert();
        this.setState({ chartWidth: window.innerWidth });
    }

    componentDidUpdate(prevProps) {
        const { cpuHistory2 } = prevProps.model;

        let sum = 0;
        let avg = 0;

        if (cpuHistory2.length === 10) {
            sum = cpuHistory2.reduce((a, b) => {
                return a + parseInt(b.cpu);
            }, 0);
            avg = sum / cpuHistory2.length;
        }

        console.log(avg);

        if (avg > 10) {
            Alert.info("Resized", {
                position: "top-right",
                effect: "slide",
                timeout: "none"
            });
        }
    }

    handleAlert() {
        Alert.info("Resized", {
            position: "top-right",
            effect: "slide",
            timeout: "none"
        });
    }

    render() {
        const { cpuHistory2, cpuHistory10, cpuHistory15 } = this.props.model;

        return (
            <div>
                <Alert stack={{ limit: 3 }} />
                <Chart data={cpuHistory10} width={this.state.chartWidth} />
            </div>
        );
    }
}

export default App;
