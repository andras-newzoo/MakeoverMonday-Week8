import React, { Component } from 'react'
import BarChart from './chart/BarChart'
import Controls from './components/Controls'
import data from './data/data.json'
import {stateOptions} from './data/dropdownData.js'
import './App.css'

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      dimensions: {
          height: 20000,
          width: undefined
      },
      states: this.populateStateList()
    }

  }

  componentDidMount = () => {
    window.addEventListener("resize", this.handleResize);
    setTimeout(() => this.handleResize(), 200);
  }

  populateStateList = () => [...new Set(data.sort((a,b) =>
    a.State.localeCompare(b.State) ).map(d => d.State))]

  handleResize = () => {
    this.setState({
      dimensions: {
        height: this.container && this.container.clientHeight,
        width: this.container && this.container.clientWidth
      }
    });
  }

  handleDropdownChange = (value) => {
    let highlight = {...this.state}
    if(value.length === 0){
      highlight.states = this.populateStateList()
    } else { highlight.states = value}
    this.setState( highlight )
  }

  formatData(raw){

    return raw.forEach( d => {
      d.state = d.State
      d.region = d.Region.toUpperCase()
      d.homesPowered = d['Homes Powered']
      d.invPerHome = d['Investment Per Home']
      d.totalInv = d['Total Investment']

    })

  }

  render() {

    const { dimensions, states } = this.state,
          { height, width } = dimensions,
          statesArray = this.populateStateList(),
          stateOptions = [],
          margin = 100,
          textPropsOne = {x: 0, y: 0, text: 'Power capacity as equivalent of homes powered', anchor: 'start'},
          textPropsTwo = {x: width * .5 - margin, y: 0, text: 'Investment ($) per homes powered', anchor: 'end'}

    for( let i = 0; i < statesArray.length; i++){

    stateOptions.push({
                      key: statesArray[i],
                      value: statesArray[i],
                      text: statesArray[i]
                      })
    }
    // console.log(states)
    this.formatData(data)

    data.sort((a,b) => a.homesPowered - b.homesPowered)

    return (
      <div className="visualization" ref={parent => (this.container = parent)}>
        <div className="text-controls">
            <Controls
              stateOptions = {stateOptions}
              handleDropdownChange = {this.handleDropdownChange}
            />
        </div>
        <div className="chart-one">
            <BarChart
              data = {data}
              xKey = {'homesPowered'}
              chartClass = {'-one'}
              width= {width/2}
              height= {height}
              marginLeft = {margin}
              marginRight = {0}
              yAxisText = {'text'}
              yAxisDomain = {'.domain'}
              rangeToggle = {'right'}
              highlight = {states}
              numberFormat = {"$,.0d"}
              text = {textPropsOne}

            />
        </div>
        <div className="chart-two">
            <BarChart
              data = {data}
              xKey = {'invPerHome'}
              chartClass = {'-two'}
              width= {width/2}
              height= {height}
              marginLeft = {0}
              marginRight = {margin}
              rangeToggle = {'left'}
              highlight = {states}
              numberFormat = {"$,.0d"}
              text = {textPropsTwo}
            />
        </div>
      </div>
    );
  }
}

export default App;
