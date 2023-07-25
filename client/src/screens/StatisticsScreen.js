import * as d3 from "d3";


const Statistics = () => {
    {
// Declare the chart dimensions and margins.
                const width = 640;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

// Declare the x (horizontal position) scale.
const x = d3
.scaleUtc()
.domain([new Date('2023-01-01'), new Date('2024-01-01')])
.range([marginLeft, width - marginRight]);

// Declare the y (vertical position) scale.
const y = d3
.scaleLinear()
.domain([0, 100])
.range([height - marginBottom, marginTop]);

// Create the SVG container.
const svg = d3.create('svg').attr('width', width).attr('height', height);

// Add the x-axis.
svg
.append('g')
.attr('transform', `translate(0,${height - marginBottom})`)
.call(d3.axisBottom(x));

// Add the y-axis.
svg.append('g').attr('transform', `translate(${marginLeft},0)`).call(d3.axisLeft(y));

// Return the SVG element.
return svg.node();
}
import { select, selectAll, scaleUtc, scaleLinear, axisBottom, axisLeft, create } from 'd3';

const Statistics = () => {
  // Declare the chart dimensions and margins.
  const width = 640;
  const height = 400;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;

  // Declare the x (horizontal position) scale.
  const x = scaleUtc()
    .domain([new Date('2023-01-01'), new Date('2024-01-01')])
    .range([marginLeft, width - marginRight]);

  // Declare the y (vertical position) scale.
  const y = scaleLinear()
    .domain([0, 100])
    .range([height - marginBottom, marginTop]);

  // Create the SVG container.
  const svg = create('svg').attr('width', width).attr('height', height);

  // Add the x-axis.
  svg
    .append('g')
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(axisBottom(x));

  // Add the y-axis.
  svg.append('g').attr('transform', `translate(${marginLeft},0)`).call(axisLeft(y));

  // Return the SVG element.
  return svg.node();
};

// Call the function and append the chart to the container.
const chartContainer = document.getElementById('chart-container');
const svgChart = Statistics();
chartContainer.appendChild(svgChart);
