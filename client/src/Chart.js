import React from "react";
import PropTypes from "prop-types";
import { withFauxDOM } from "react-faux-dom";
import * as d3 from "d3";
import "./Chart.css";

var formatMinutes = function(d) {
    var hours = Math.floor(d / 3600),
        minutes = Math.floor((d - hours * 3600) / 60),
        seconds = d - minutes * 60;
    var output = seconds + "s";
    if (minutes) {
        output = minutes + "m " + output;
    }
    if (hours) {
        output = hours + "h " + output;
    }
    return output;
};

class Chart extends React.Component {
    constructor(props) {
        super(props);

        this.renderD3 = this.renderD3.bind(this);
        this.updateD3 = this.updateD3.bind(this);

        // set the dimensions and margins of the graph
        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const width = props.width - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // set the ranges
        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y);

        this.state = { x, y, xAxis, yAxis, margin, width, height };
    }

    componentDidMount() {
        this.renderD3();
    }

    componentDidUpdate(prevProps, prevState) {
        // do not compare props.chart as it gets updated in updateD3()
        if (this.props.data !== prevProps.data) {
            this.updateD3();
        }
    }

    componentWillReceiveProps(nextProps) {
        //console.log(nextProps);
        //this.updateStateFromProps(nextProps);
        //this.renderD3();
    }

    // componentWillMount() {
    //     const { xAxis, yAxis, grid } = this.state;

    // const svg = d3.select(this.svg).transition();
    // svg.select(`.${classes.xAxis}`)
    //   .duration(100)
    //   .call(xAxis);

    //     svg
    //         .append("g")
    //         .attr("transform", "translate(0," + height + ")")
    //         .call(d3.axisBottom(x));
    // }

    updateStateFromProps = props => {
        //console.log("hello");
        //const x = this.state.x.domain(d3.extent(props.data, d => d.date));
        //this.setState({ x });
    };

    render() {
        return <div>{this.props.chart}</div>;
    }

    renderD3() {
        const { data } = this.props;

        const { x, y, xAxis, yAxis, margin, width, height } = this.state;

        // This will create a faux div and store its virtual DOM in state.chart
        var faux = this.props.connectFauxDOM("div", "chart");

        // parse the date / time
        var parseTime = d3.timeParse("%Q");
        // var midnight = parseTime("00:00:00");

        // define the area
        var area = d3
            .area()
            .x(function(d) {
                return x(d.timestamp);
            })
            .y0(height)
            .y1(function(d) {
                return y(d.cpu);
            });

        // define the line
        var valueline = d3
            .line()
            .x(function(d) {
                return x(d.timestamp);
            })
            .y(function(d) {
                return y(d.cpu);
            });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin

        var svg = d3
            .select(faux)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr(
                "transform",
                "translate(" + margin.left + "," + margin.top + ")"
            );

        // format the data
        data.forEach(function(d) {
            d.timestamp = parseTime(d.timestamp);
            d.cpu = +d.cpu;
        });

        x.domain(d3.extent(data, d => d.timestamp));

        y.domain([0, 100]);

        // add the area
        svg
            .append("path")
            .data([data])
            .attr("class", "area")
            .attr("d", area);

        // add the valueline path.
        svg
            .append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);

        // add the X Axis
        svg
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the Y Axis
        svg.append("g").call(d3.axisLeft(y));
    }

    updateD3() {
        const { data } = this.props;
        const { x, y, xAxis, height } = this.state;

        // reattach to faux dom
        var faux = this.props.connectFauxDOM("div", "chart");

        var parseTime = d3.timeParse("%Q");

        // define the area
        var area = d3
            .area()
            .x(function(d) {
                return x(d.timestamp);
            })
            .y0(height)
            .y1(function(d) {
                return y(d.cpu);
            });

        var valueline = d3
            .line()
            .x(function(d) {
                return x(d.timestamp);
            })
            .y(function(d) {
                return y(d.cpu);
            });

        var svg = d3.select(faux).select("svg");

        // format the data
        data.forEach(function(d) {
            d.timestamp = parseTime(d.timestamp);
            d.cpu = +d.cpu;
        });

        x.domain(d3.extent(data, d => d.timestamp));

        svg
            .select(".area")
            .data([data])
            .attr("d", area);

        svg
            .select(".line")
            .data([data])
            .attr("d", valueline);

        svg.select(".x-axis").call(d3.axisBottom(x));

        this.props.animateFauxDOM(800);
    }
}

const FauxChart = withFauxDOM(Chart);

export default FauxChart;
