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

    handleAlert() {
        Alert.info("Resized", {
            position: "top-right",
            effect: "slide",
            timeout: "none"
        });
    }

    render() {
        const { history } = this.props.model;
        // console.log(history);
        return (
            <div>
                <Alert stack={{ limit: 3 }} />
                <Chart data={history} width={this.state.chartWidth} />
            </div>
        );
    }
}

export default App;
