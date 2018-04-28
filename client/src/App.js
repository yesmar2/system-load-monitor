import React from "react";
import Chart from "./Chart";

const chartData = [
    {
        cpu: 55,
        timestamp: 1524913814907
    },
    {
        cpu: 10,
        timestamp: 1524913824969
    },
    {
        cpu: 15,
        timestamp: 1524913834964
    }
];

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
        this.setState({ chartWidth: window.innerWidth });
    }

    render() {
        const { history } = this.props.model;
        // console.log(history);
        return (
            <div>
                <Chart data={history} width={this.state.chartWidth} />
            </div>
        );
    }
}

export default App;
