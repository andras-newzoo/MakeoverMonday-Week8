import React, {Component} from 'react'
import './Chart.css'
import { select, event as currentEvent } from 'd3-selection'
import { scaleBand, scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { axisRight } from 'd3-axis'
import { format } from 'd3-format'
import { transition } from 'd3-transition'


class BarChart extends Component {

  componentDidUpdate(prevProps){

    const {data} = this.props

    if(prevProps.height === 20000)
    {this.initVis(data)}
    else if (this.props.width != prevProps.width || this.props.height != prevProps.height)
    {this.updateDimensions()}

    if(prevProps.highlight != this.props.highlight){
      this.updateData(data)
    }
  }

  createTooltip(){

      select('body').append('div').attr('class', `tooltip${this.props.chartClass} tooltip`)

      select(`.tooltip${this.props.chartClass}`)
          .html(
              "<text>The state of </text><text class='bold state-name'></text><text> has invested </text><text class='bold investment'></text><text> in Wind Energy</text></br>" +
              "<text>With capability of powering </text><text class='bold no-of-homes'></text><text> homes, it translates to </text><text class='bold investment-per-home'></text><text> per home powered</text></br>"
          )
  }

  initVis(data){

    this.createTooltip()

    const { margin, width, height, transition, chartClass, xKey, yAxisText, marginLeft, marginRight, rangeToggle, yAxisDomain, highlight, colors} = this.props,
          { selected, notSelected} = colors,
          chartHeight = height - margin.top - margin.bottom,
          chartWidth = width - marginLeft - marginRight,
          svg = select(this.node),
          tooltip = select(`.tooltip${chartClass}`)

    svg.attr('height', height).attr('width', width)

    console.log(highlight)

    svg.append('g')
        .attr('class', `chart-area${chartClass}`)
        .attr('transform', `translate(${marginLeft},${margin.top})`)
    svg.append('g')
        .attr('class', `y-axis${chartClass} y-axis`)
        .attr('transform', `translate(${marginLeft},${margin.top})`)

    const rects = select(`.chart-area${chartClass}`).selectAll('rect').data(data, d => d.state)

    this.yAxis = select(`.y-axis${chartClass}`)
    this.xScale = scaleLinear().range(rangeToggle === 'right' ? [chartWidth, 0] : [0, chartWidth]).domain([0, max(data, d => d[xKey]) ])
    this.yScale = scaleBand().range([chartHeight, 0]).domain(data.map(d => d.state)).padding(.1)
    this.yAxisCall = axisRight(this.yScale).tickSizeInner(3).tickSizeOuter(0)

    this.yAxis.transition('y-axis' + chartClass).duration(transition.long).call(this.yAxisCall)
    this.yAxis.selectAll(yAxisText).remove()
    this.yAxis.selectAll('.tick line').remove()
    this.yAxis.selectAll(yAxisDomain).remove()

    rects.enter()
        .append('rect')
        .attr('class', d => d.state + '-rect')
        .attr('height', this.yScale.bandwidth())
        .attr('y', d => this.yScale(d.state))
        .attr('width', d => rangeToggle === 'right' ? this.xScale(0) + this.xScale(d[xKey]) : this.xScale(0) )
        .attr('x', d => this.xScale(0))
        .on('mouseover', d => {
            tooltip.style('opacity', .9)
              tooltip.select('.state-name').text(d.state)
              tooltip.select('.investment').text(format('$,d')(d.totalInv) + 'M')
              tooltip.select('.no-of-homes').text(format(',d')(d.homesPowered))
              tooltip.select('.investment-per-home').text(format('$,d')(d.invPerHome))  })
        .on('mousemove', d => {
            tooltip.style("left", (currentEvent.pageX + 10) + "px").style("top", (currentEvent.pageY + 10) + "px")})
        .on('mouseout', d =>
            tooltip.style("opacity", 0))
        .attr('fill', selected)
            .merge(rects)
            .transition('rect-init')
            .duration(transition.long)
            .attr('width', d => rangeToggle === 'right' ? this.xScale(0) + this.xScale(d[xKey]) : this.xScale(d[xKey]) )
            .attr('x', d => rangeToggle === 'right' ? this.xScale(d[xKey]) : this.xScale(0))

        select(`.chart-area${chartClass}`).append('text')
            .attr('class', `axis-label${chartClass}`)
            .attr('x', this.props.text.x)
            .attr('y', this.props.text.y)
            .attr('fill', '#333')
            .text(this.props.text.text)
            .attr('text-anchor', this.props.text.anchor)
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

      select(`.axis-label${chartClass}`)
          .attr('x', this.props.text.x)

  }

  updateData(){
    const {chartClass, highlight, colors, transition} = this.props,
          {selected, notSelected} = colors

    select(`.chart-area${chartClass}`).selectAll('rect')
          .transition('color-change')
          .duration(transition.long)
          .attr('fill', d => highlight.includes(d.state) ? selected : notSelected)
  }

  render(){
    return (
      <svg ref={node => this.node = node}/>
    )
  }
}

BarChart.defaultProps = {
  margin: {
    top: 50,
    bottom: 50,
  },
  transition: {
    short: 200,
    long: 1000
  },
  colors: {
    selected: '#5BA581',
    notSelected: '#C1CCC1'
  }

}

export default BarChart;
