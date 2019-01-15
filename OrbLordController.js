const express = require('express');
const bodyParser = require('body-parser');
const { Socket } = require('net');
const createOPCStream = require('opc');
const createStrand = require('opc/strand');


const port = 3000;

class OrbLordController {
  constructor({
    width, height, debug = true, controls = [], black = [0, 0, 0],
  }) {
    this.width = width;
    this.height = height;
    this.debug = debug;
    this.controls = controls;
    this.black = black;
    this.controlState = controls.reduce(
      (controlState, controller) => {
        switch (controller.type) {
          case 'BUTTON':
            return Object.assign({}, controlState, { [controller.name]: 'UP' });
          default:
            return controlState;
        }
      }, {},
    );
    console.log(this.controlState);

    this.commandQueues = [];

    this._clearDebugMap();
    this._initFadeCandy();
    this._initServer();
  }

  _clearDebugMap() {
    this.debugMap = Array(this.height).fill(0).map(() => Array(this.width).fill([0, 0, 0]));
  }

  _initFadeCandy() {
    this.socket = new Socket();
    this.socket.setNoDelay;
    this.socket.on('error', (err) => {
      if (err.code === 'ECONNREFUSED' && this.debug) {
        console.warn('FadeCandy not connected, running in debug mode!');
      } else {
        throw Error(err);
      }
    });
    this.socket.connect(7890);
    this.stream = createOPCStream();
    this.stream.pipe(this.socket);
    this.strand = createStrand(this.width * this.height);
  }

  _initServer() {
    this.app = express();
    const server = require('http').Server(this.app);
    this.debugSocket = require('socket.io')(server);
    this.app.use(bodyParser.json());
    this.app.use('/', express.static('../debugger/build'));
    this.app.post('/cmd', (req, res) => {
      this.handleCommand(req.body);
      res.sendStatus(200);
    });
    this.debugSocket.on('connection', (socket) => {
      socket.emit('controls', this.controls);
    });
    server.listen(port, () => console.log(`Orblord controller listening on port ${port}!`));
  }

  handleCommand(command) {
    this.commandQueues.forEach((commandQueue) => {
      commandQueue.pushCommand(command);
    });
    this.controlState[command.control] = command.state;
  }

  registerCommandQueue(commandQueue) {
    this.commandQueues.push(commandQueue);
  }

  _getLED(x, y) {
    return y * this.width + x;
  }

  clear() {
    this._clearDebugMap();
    Array(this.width * this.height).fill(0).forEach((item, index) => { this.strand.setPixel(index, ...this.black); });
  }

  point([x, y], [r = 255, g = 255, b = 255]) {
    // skip pixels that overflow
    if (x < 0 || x > this.width - 1) return;
    if (y < 0 || y > this.height - 1) return;

    this.strand.setPixel(this._getLED(x, y), g, r, b);
    this.debugMap[y][x] = [r, g, b];
  }

  absolutePoint(n, [r = 255, g = 255, b = 255]) {
    this.strand.setPixel(n, g, r, b);
  }

  shape(shape) {
    this.points(shape.getPoints());
  }

  points(array) {
    array.forEach(point => this.point(point[0], point[1]));
  }

  draw() {
    this.stream.writePixels(0, this.strand.buffer);
    this.debugSocket.sockets.emit('map', this.debugMap);
  }
}

module.exports = OrbLordController;
