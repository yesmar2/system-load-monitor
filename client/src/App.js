import React from "react";
import Drawer from "material-ui/Drawer";
import IconButton from "material-ui/IconButton";
import Badge from "material-ui/Badge";
import { withStyles } from "material-ui/styles";
import Alert from "react-s-alert";
import Chart from "./Chart";
import "./App.css";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";

const styles = {
    badge: {
        background: "rgb(247, 90, 91)",
        color: "#fff"
    }
};

class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleResize = this.handleResize.bind(this);

        this.state = {
            chartWidth: window.innerWidth,
            loadStatus: "normal",
            open: false
        };
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
                        timeout: 3000,
                        html: true
                    }
                );
            }
        }
    }

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { open } = this.state;
        const { model, classes } = this.props;

        return (
            <div className="app">
                <header>
                    <h1>CPU Load Monitor</h1>
                    <h2>% utilization over past 10 minutes</h2>
                </header>
                <div className="notifications">
                    <IconButton onClick={this.handleDrawerOpen}>
                        <Badge
                            badgeContent={4}
                            classes={{
                                badge: classes.badge
                            }}
                        >
                            <i class="material-icons">notifications</i>
                        </Badge>
                    </IconButton>
                </div>
                <Drawer
                    variant="persistent"
                    open={open}
                    anchor="right"
                    onCLose={this.handleDrawerClose}
                >
                    <IconButton onClick={this.handleDrawerClose}>
                        <i class="material-icons">chevron_right</i>
                    </IconButton>
                </Drawer>
                <Chart
                    data={model.cpuHistory10}
                    width={this.state.chartWidth}
                />

                <Alert stack={{ limit: 6 }} />
            </div>
        );
    }
}

export default withStyles(styles)(App);
