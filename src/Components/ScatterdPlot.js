import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Tooltip from './Tooltip';

const ScatterdPlot = () => {
  const svgRef = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const DisplayScatterPlot = async () => {
      //get the data from the api
      setLoading(true);
      const data = await fetch('http://localhost:8000/api/v1/sentences').then(
        (res) => res.json(),
      );
      setLoading(false);
      //set up accessor functions

      // set the dimensions and margins of the graph
      const margin = { top: 20, right: 30, bottom: 130, left: 60 },
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      const svg = d3
        .select(svgRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // Parse the Data

      // Add Y axis
      const y = d3.scaleLinear().domain([-9, 9]).range([height, 0]).nice();
      svg.append('g').call(d3.axisLeft(y));

      // X axis
      const x = d3
        .scaleBand()
        .range([0, width])
        .domain(
          data.map((d) => {
            if (d.category === '[]') d.category = 'unknown';
            return d.category;
          }),
        )
        .padding(0.5);
      svg
        .append('g')
        .call(d3.axisBottom(x))
        .attr('transform', `translate(0, ${height})`)
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end');

      //Tooltip
      const tooltip = d3
        .select('.PlotContainer')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

      //Circles
      svg
        .selectAll('myRect')
        .data(data)
        .join('circle')
        .attr(
          'class',
          (d) =>
            'bar bar--' + (d.sentence_sent_score < 0 ? 'negative' : 'positive'),
        )
        .attr('cy', (d) => y(d.sentence_sent_score))
        .attr('cx', (d) => x(d.category) + x.bandwidth() / 2)
        .attr('r', 4) // Change this to your element(s)
        .on('mouseenter', (d, i) => {
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip
            .html(Tooltip(i))
            .style('left', d.pageX + 'px')
            .style('top', d.pageY + 'px'); 
        })
        .on('mouseout', function (d, i) {
          tooltip.transition().duration(200).style('opacity', 0);
        });
    };
    DisplayScatterPlot();
  }, []);
  return (
    <div className="PlotContainer">
      <svg ref={svgRef} />
      {loading && <h1>Loading...</h1>}
      <div className="tooltip"></div>
    </div>
  );
};

export default ScatterdPlot;
