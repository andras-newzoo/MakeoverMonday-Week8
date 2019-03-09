import React, {Component} from 'react'
import { Dropdown } from 'semantic-ui-react'
import './Controls.css'


class Controls extends Component{

  componentDidMount(){

  }

  handleDropdownChange = (e, {value}) => {
    this.props.handleDropdownChange(value);
  }


  render(){
      return(
        <div>
          <Dropdown
              placeholder='Select a state:'
              fluid multiple search selection
              onChange = {this.handleDropdownChange}
              options={this.props.stateOptions} />
        </div>
      )
  }
}

export default Controls
