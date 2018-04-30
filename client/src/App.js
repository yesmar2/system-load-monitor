import React from "react";
import Alert from "react-s-alert";
import Chart from "./Chart";
import "./App.css";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleResize = this.handleResize.bind(this);

        this.state = { chartWidth: window.innerWidth, loadStatus: "normal" };
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize() {
        this.setState({ chartWidth: window.innerWidth });
    }

    componentDidUpdate(prevProps) {
        const { cpuHistory2 } = prevProps.model;

        let sum = 0;
        let avg = 0;

        if (cpuHistory2.length > 0) {
            sum = cpuHistory2.reduce((a, b) => {
                return a + parseInt(b.cpu);
            }, 0);
            avg = sum / cpuHistory2.length;
        }

        if (avg > 20) {
            if (this.state.loadStatus === "normal") {
                this.setState({ loadStatus: "high" });
                Alert.error(
                    `<h1>High load generation alert</h1><h2>CPU = ${avg}%, triggered at 10:00 AM</h2>`,
                    {
                        position: "top-right",
                        effect: "slide",
                        timeout: "none",
                        html: true
                    }
                );
            }
        } else {
            if (this.state.loadStatus === "high") {
                this.setState({ loadStatus: "normal" });
                Alert.success(
                    "<h1>Alert recovered</h1><h2>Triggered at 10:01 AM</h2>",
                    {
                        position: "top-right",
                        effect: "slide",
                        timeout: "none",
                        html: true
                    }
                );
            }
        }
    }

    render() {
        const { cpuHistory2, cpuHistory10, cpuHistory15 } = this.props.model;

        return (
            <div className="app">
                <header>
                    <h1>CPU Load Monitor</h1>
                    <h2>% utilization over past 10 minutes</h2>
                </header>
                <Chart data={cpuHistory10} width={this.state.chartWidth} />
                <Alert stack={{ limit: 6 }} />
            </div>
        );
    }
}

export default App;
