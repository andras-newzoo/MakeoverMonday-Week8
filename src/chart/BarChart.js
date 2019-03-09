import React, {Component} from 'react'
import './Chart.css'
import { select } from 'd3-selection'
import { scaleBand, scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { axisRight } from 'd3-axis'
import { format } from 'd3-format'
import { transition } from 'd3-transition'
import { timeFormat, timeParse } from 'd3-time-format';


class BarChart extends Component {

  componentDidUpdate(prevProps){

    if(prevProps.height === 20000)
    {this.initVis(this.props.data)}
    else if (this.props.width != prevProps.width || this.props.height != prevProps.height)
    {this.updateDimensions()}

  }

  initVis(data){

    const { margin, width, height, transition, chartClass, xKey, yAxisText, marginLeft, marginRight, rangeToggle, yAxisDomain, highlight} = this.props,
          chartHeight = height - margin.top - margin.bottom,
          chartWidth = width - marginLeft - marginRight,
          svg = select(this.node)

    svg.attr('height', height).attr('width', width)

    console.log(highlight)

    svg.append('g')
        .attr('class', `chart-area${chartClass}`)
        .attr('transform', `translate(${marginLeft},${margin.top})`)
    svg.append('g')
        .attr('class', `y-axis${chartClass}`)
        .attr('transform', `translate(${marginLeft},${margin.top})`)

    const rects = select(`.chart-area${chartClass}`).selectAll('rect').data(data, d => d.state)

    this.yAxis = select(`.y-axis${chartClass}`)
    this.xScale = scaleLinear().range(rangeToggle === 'right' ? [chartWidth, 0] : [0, chartWidth]).domain([0, max(data, d => d[xKey]) ])
    this.yScale = scaleBand().range([chartHeight, 0]).domain(data.map(d => d.state)).padding(.1)
    this.yAxisCall = axisRight(this.yScale).tickSize(0)

    this.yAxis.transition('y-axis' + chartClass).duration(transition.long).call(this.yAxisCall)
    this.yAxis.selectAll(yAxisText).remove()
    this.yAxis.selectAll(yAxisDomain).remove()

    rects.enter()
        .append('rect')
        .attr('class', d => d.state + '-rect')
        .attr('height', this.yScale.bandwidth())
        .attr('y', d => this.yScale(d.state))
        .attr('width', d => rangeToggle === 'right' ? this.xScale(0) + this.xScale(d[xKey]) : this.xScale(0) )
        .attr('x', d => this.xScale(0))
        .attr('fill', 'steelblue')
            .merge(rects)
            .transition('rect-init')
            .duration(transition.long)
            .attr('width', d => rangeToggle === 'right' ? this.xScale(0) + this.xScale(d[xKey]) : this.xScale(d[xKey]) )
            .attr('x', d => rangeToggle === 'right' ? this.xScale(d[xKey]) : this.xScale(0))
  }

  updateDimensions(){

      const { margin, width, height, xKey, chartClass, yAxisText, yAxisDomain, marginLeft, marginRight, rangeToggle} = this.props,
              chartHeight = height - margin.top - margin.bottom,
              chartWidth = width - marginLeft - marginRight,
              svg = select(this.node)

      svg.attr('height', height).attr('width', width)

      this.xScale.range(rangeToggle === 'right' ? [chartWidth, 0] : [0, chartWidth])
      this.yScale.range([chartHeight, 0])

      this.yAxis.call(this.yAxisCall)
      this.yAxis.selectAll(yAxisText).remove()
      this.yAxis.selectAll(yAxisDomain).remove()

      select(`.chart-area${chartClass}`)
          .selectAll('rect')
          .attr('height', this.yScale.bandwidth())
          .attr('y', d => this.yScale(d.state))
          .attr('width', d => rangeToggle === 'right' ? this.xScale(0) + this.xScale(d[xKey]) : this.xScale(d[xKey]) )
          .attr('x', d => rangeToggle === 'right' ? this.xScale(d[xKey]) : this.xScale(0))


  }

  render(){
    return (
      <svg ref={node => this.node = node}/>
    )
  }
}

BarChart.defaultProps = {
  margin: {
    top: 20,
    bottom: 20,
  },
  transition: {
    short: 200,
    long: 1000
  }

}

export default BarChart;
