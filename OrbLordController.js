const express = require('express')
const bodyParser = require('body-parser');
const Socket = require("net").Socket;
const createOPCStream = require("opc");
const createStrand = require("opc/strand");



const port = 3000

class OrbLordController {
  constructor(){
    this.socket = new Socket();
    this.socket.setNoDelay
    this.socket.connect(7890);
    this.stream = createOPCStream();
    this.stream.pipe(this.socket);
    this.strand = createStrand(198);
    this.commandQueue = [];
    this._initEventServer();
  }
  _initEventServer(){
    this.app = express()
    this.app.use(bodyParser.json())
    this.app.post('/cmd', (req, res) => {
      console.log(req.body);
      this._pushCommand(req.body.key)
      res.sendStatus(200);
    })
    this.app.listen(port, () => console.log(`Orblord controller listening on port ${port}!`))
  }

  _pushCommand(command){
    this.commandQueue.push(command)
  }
  popCommands(){
    const result = [].concat(this.commandQueue);
    this.commandQueue = [];
    return result;
  }
  _getLED(x,y){
    return y*11 + x;
  }
  clear(){
    Array(198).fill(0).forEach((item, index)=>{this.strand.setPixel(index, 0, 0, 0)});
  }
  point(x, y, r=255, g=255, b=255){
    this.strand.setPixel(this._getLED(x,y), g, r, b);
  }
  points(array){
    array.forEach(point => this.point(point[0], point[1], point[2], point[3], point[4]))
  }
  draw(){
    this.stream.writePixels(0, this.strand.buffer)
  }
}

module.exports = OrbLordController;










//
// Array(198).fill(0).forEach((item, index)=>{strand.setPixel(index, 0, 0, 0)})
// strand.setPixel(getLED(state.x, state.y), 255, 255, 255)
// stream.writePixels(0, strand.buffer)
