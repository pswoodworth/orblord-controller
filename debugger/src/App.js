import React, { Component } from 'react';
import './App.css';
import Orbs from './Orbs';
import Controls from './Controls';
import io from 'socket.io-client';



class App extends Component {
  constructor() {
    super();
    this.state = {
      socketConnected: false,
    }
  }
  componentDidMount() {
    this.socket = io();
    this.socket.on('connect', ()=>{
      console.log('CONNECTED!');
      this.setState({
        socketConnected: true
      })
    })
    this.socket.on('map', (orbs) => {
      this.setState({ orbs })
    })
    this.socket.on('controls', (controls) => {
      console.log('RECEIVED CONTROLS', controls);
      this.setState({ controls })
    })
  }
  render() {
    return (
      <div>
        {
          this.state.socketConnected && this.state.orbs ?
          <div class="wrapper">
            <Orbs orbs={this.state.orbs}/>
            <Controls controls={this.state.controls}/>
          </div>
           :
          <h1>Waiting for socket connection...</h1>
        }
      </div>
    )
  }
}

export default App;
