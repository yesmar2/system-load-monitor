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

function timeSince(date) {
    var minutes = (new Date() - date) / 1000 / 60;

    //var interval = Math.floor(seconds / 31536000);

    //   if (interval > 1) {
    //     return interval + " years";
    //   }
    //   interval = Math.floor(seconds / 2592000);
    //   if (interval > 1) {
    //     return interval + " months";
    //   }
    //   interval = Math.floor(seconds / 86400);
    //   if (interval > 1) {
    //     return interval + " days";
    //   }
    //   interval = Math.floor(seconds / 3600);
    //   if (interval > 1) {
    //     return interval + " hours";
    //   }
    //   interval = Math.floor(seconds / 60);
    //   if (interval > 1) {
    //     return interval + " minutes";
    //   }
    return minutes;
}

class Chart extends React.Component {
    constructor(props) {
        super(props);

        this.renderD3 = this.renderD3.bind(this);
        this.updateD3 = this.updateD3.bind(this);

        // set the dimensions and margins of the graph
        const margin = { top: 30, right: 30, bottom: 50, left: 50 };
        const width = props.width - margin.left - margin.right;
        const height = window.innerHeight - margin.top - margin.bottom;

        // set the ranges
        const x = d3.scaleLinear().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        // const xAxis = d3.axisBottom(x).ticks(5);
        // const yAxis = d3.axisLeft(y);

        this.state = { x, y, margin, width, height };
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

    render() {
        return <div>{this.props.chart}</div>;
    }

    renderD3() {
        const { data } = this.props;

        const { x, y, margin, width, height } = this.state;

        // This will create a faux div and store its virtual DOM in state.chart
        var faux = this.props.connectFauxDOM("div", "chart");

        // Initialize graph
        var svg = d3
            .select(faux)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "graph")
            .attr(
                "transform",
                "translate(" + margin.left + "," + margin.top + ")"
            );

        // Set domain range for axes
        x.domain([10, 0]);
        y.domain([0, 100]);

        // add a path tags for the area and line
        svg.append("path").attr("class", "area");
        svg.append("path").attr("class", "line");

        // add the X Axis
        svg
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(
                d3
                    .axisBottom(x)
                    .ticks(5)
                    .tickFormat(d => d + "m ago")
            );

        // add the Y Axis
        svg.append("g").call(d3.axisLeft(y));

        svg
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 3.5)
            .attr("cx", function(d) {
                return x(d.timestamp);
            })
            .attr("cy", function(d) {
                return y(d.cpu);
            });
    }

    updateD3() {
        const { data } = this.props;
        const { x, y, height } = this.state;

        // reattach to faux dom
        var faux = this.props.connectFauxDOM("div", "chart");

        var svg = d3
            .select(faux)
            .select("svg")
            .select(".graph");

        // format the data
        data.forEach(function(d) {
            d.timestamp = timeSince(d.timestamp);
            d.cpu = +d.cpu;
        });

        // Define the area and line with updated data
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

        // Render line and area
        svg
            .select(".area")
            .datum(data)
            .attr("d", area);

        svg
            .select(".line")
            .datum(data)
            .attr("d", valueline);

        // remove to re-render below
        svg.selectAll("circle").remove();

        // Add the scatterplot
        svg
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", 6)
            .attr("cx", function(d) {
                return x(d.timestamp);
            })
            .attr("cy", function(d) {
                return y(d.cpu);
            });

        this.props.animateFauxDOM(800);
    }
}

const FauxChart = withFauxDOM(Chart);

export default FauxChart;
