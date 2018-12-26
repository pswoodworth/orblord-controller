import React, { Component } from 'react';

export default class Controls extends Component {
  constructor(){
    super()
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.getMouseHandler = this.getMouseHandler.bind(this);
  }
  getMouseHandler(control, state) {
    return this.sendCommand.bind(this, {control: control.name, state: state});
  }
  sendCommand(commandData){
    console.log(`SENDING COMMAND ${JSON.stringify(commandData)}`);
    fetch('/cmd', {
      method: 'POST',
      body: JSON.stringify(commandData),
      headers:{
      'Content-Type': 'application/json'
    }
    }).then(function(response) {
    })
  }
  handleKeyPress(event){
    const key = event.key;
    const state = event.type === 'keydown' ? 'DOWN' : 'UP';
    this.props.controls.forEach((control)=>{
      if(control.debugKey === key){
        this.sendCommand({control: control.name, state });
      }
    })
  }
  render() {
    return (
      <div className="controls" onKeyDown={this.handleKeyPress} onKeyUp={this.handleKeyPress} tabIndex="0">
        {
          this.props.controls.filter(c => c.type === 'BUTTON').map( (control, controlId) => (
            <div key={`control-${controlId}`} className="control" onMouseDown={this.getMouseHandler(control, 'DOWN')} onMouseUp={this.getMouseHandler(control, 'UP')}>
              { control.debugLabel }
            </div>
          ))
        }
      </div>
    )
  }
};
