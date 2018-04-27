import React from "react";
import PropTypes from "prop-types";
import { withFauxDOM } from "react-faux-dom";
import * as d3 from "d3";
import "./Chart.css";

class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.renderD3 = this.renderD3.bind(this);
    }

    componentDidMount() {
        this.renderD3();
    }

    componentDidUpdate(prevProps, prevState) {}

    render() {
        return <div>{this.props.chart}</div>;
    }

    renderD3() {
        const { chartData } = this.props;
        // This will create a faux div and store its virtual DOM in state.chart
        var faux = this.props.connectFauxDOM("div", "chart");

        /*
       D3 code below by Alan Smith, http://bl.ocks.org/alansmithy/e984477a741bc56db5a5
       The only changes made for this example are...
       1) feeding D3 the faux node created above
       2) calling this.animateFauxDOM(duration) after each animation kickoff
       3) move data generation and button code to parent component
       4) data and title provided as props by parent component
       5) reattach to faux dom for updates
       6) move rejoining of data and chart updates to updateD3()
       7) code update for D3 version 4
    */

        // set the dimensions and margins of the graph
        var margin = { top: 20, right: 20, bottom: 30, left: 50 },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // parse the date / time
        var parseTime = d3.timeParse("%d-%b-%y");

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // define the area
        var area = d3
            .area()
            .x(function(d) {
                return x(d.date);
            })
            .y0(height)
            .y1(function(d) {
                return y(d.close);
            });

        // define the line
        var valueline = d3
            .line()
            .x(function(d) {
                return x(d.date);
            })
            .y(function(d) {
                return y(d.close);
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
        chartData.forEach(function(d) {
            d.date = parseTime(d.date);
            d.close = +d.close;
        });

        // scale the range of the data
        x.domain(
            d3.extent(chartData, function(d) {
                return d.date;
            })
        );
        y.domain([
            0,
            d3.max(chartData, function(d) {
                return d.close;
            })
        ]);

        // add the area
        svg
            .append("path")
            .data([chartData])
            .attr("class", "area")
            .attr("d", area);

        // add the valueline path.
        svg
            .append("path")
            .data([chartData])
            .attr("class", "line")
            .attr("d", valueline);

        // add the X Axis
        svg
            .append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the Y Axis
        svg.append("g").call(d3.axisLeft(y));
    }
}

const FauxChart = withFauxDOM(Chart);

export default FauxChart;
