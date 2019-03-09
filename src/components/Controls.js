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
              placeholder='Highlight a state:'
              fluid multiple search selection
              onChange = {this.handleDropdownChange}
              options={this.props.stateOptions} />
            <h1>How Many Homes Can Be Powered from Wind Energy and How Much Does It Cost?</h1>
        </div>
      )
  }
}

export default Controls
