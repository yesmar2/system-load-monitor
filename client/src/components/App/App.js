import React from "react";
import Notifications from "components/Notifications";
import Chart from "components/Chart";
import "./App.css";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartWidth: window.innerWidth,
            chartHeight: window.innerHeight,
            loadStatus: "normal"
        };
    }

    render() {
        const { model } = this.props;

        return (
            <div className="app">
                <header>
                    <h1>CPU Load Monitor</h1>
                    <h2>
                        % utilization over past 10 minutes with an alert
                        threshold of 70%
                    </h2>
                </header>
                <Notifications notifications={model.notifications} />
                <Chart data={model.cpuHistory10} />
            </div>
        );
    }
}

export default App;
