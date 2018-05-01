import React from "react";
import { withFauxDOM } from "react-faux-dom";
import * as d3 from "d3";
import timeSince from "utils/timeSince";
import "./Chart.css";

// function timeSince(date) {
//     return (new Date() - date) / 1000 / 60;
// }

class Chart extends React.Component {
    constructor(props) {
        super(props);

        this.renderD3 = this.renderD3.bind(this);
        this.updateD3 = this.updateD3.bind(this);

        // set the dimensions and margins of the graph
        this.margin = { top: 120, right: 30, bottom: 50, left: 50 };
        this.width = window.innerWidth - this.margin.left - this.margin.right;
        this.height = window.innerHeight - this.margin.top - this.margin.bottom;

        // set the ranges
        this.x = d3.scaleLinear().range([0, this.width]);
        this.y = d3.scaleLinear().range([this.height, 0]);
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
        // This will create a faux div and store its virtual DOM in state.chart
        const faux = this.props.connectFauxDOM("div", "chart");

        // Initialize graph
        const svg = d3
            .select(faux)
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("class", "graph")
            .attr(
                "transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")"
            );

        // Set domain range for axes
        this.x.domain([10, 0]);
        this.y.domain([0, 100]);

        // add a path tags for the area and line
        svg.append("path").attr("class", "area");
        svg.append("path").attr("class", "line");

        // add the X Axis
        svg
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(
                d3
                    .axisBottom(this.x)
                    .ticks(5)
                    .tickFormat(d => d + "m ago")
            );

        // add the Y Axis
        svg
            .append("g")
            .call(d3.axisLeft(this.y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("% Utilization");
    }

    updateD3() {
        const { data } = this.props;
        const x = this.x;
        const y = this.y;

        // reattach to faux dom
        const faux = this.props.connectFauxDOM("div", "chart");

        const svg = d3
            .select(faux)
            .select("svg")
            .select(".graph");

        // format the data
        data.forEach(function(d) {
            d.timestamp = timeSince(d.timestamp);
            d.cpu = +d.cpu;
        });

        // Define the area and line with updated data
        const area = d3
            .area()
            .x(function(d) {
                return x(d.timestamp);
            })
            .y0(this.height)
            .y1(function(d) {
                return y(d.cpu);
            });

        const valueline = d3
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
