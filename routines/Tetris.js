const TetrisCore = require('./TetrisCore').default;
const tetrisOptions = require('./tetris-core-options');
const Controller = require('../OrbLordController');
const { Rectangle } = require('../OrbLordCanvas');
const hexRgb = require('hex-rgb');

// const translateController = require('../translateController');

const LATCH_INTERVAL = 200;

class Tetris {
  constructor({
    controls: {
      moveLeft, moveRight, rotate, drop, start,
    }, width, height, controller, origin,
  }) {
    this.controls = {
      moveLeft, moveRight, rotate, drop, start,
    };
    this.width = width || controller.width;
    this.height = height || controller.height;
    this.origin = origin || [0, 0];
    this.controller = controller;
    this.started = false;
    this.attachControls();
    this.createClearRect();
  }

  createTC() {
    this.tc = new TetrisCore(tetrisOptions({ width: this.width, height: this.height }));
    this.tc.on('render', ({
      stage, score, speed, nextBlock, display,
    }) => {
      if (!this.started) return;
      this.clear();
      if (display) {
        display.forEach((row, y) => {
          row.forEach((color, x) => {
            if (color) {
              const rgbColor = hexRgb(color);
              this.controller.point(
                [x + this.origin[0], y + this.origin[1]],
                [rgbColor.red, rgbColor.green, rgbColor.blue],
              );
            }
          });
        });
      }
      this.controller.draw();
    });
    this.tc.on('end', () => {
      this.createTC();
      this.started = false;
    });
  }

  createClearRect() {
    this.clearRect = new Rectangle({
      topLeft: this.origin,
      bottomRight: [this.origin[0] + this.width, this.origin[1] + this.height],
      fillColor: [50, 50, 50],
    });
  }

  clear() {
    this.controller.shape(this.clearRect);
  }

  start() {
    if (!this.started) {
      this.started = true;
      this.createTC();
      this.tc.start();
    }
  }

  handleSideControl(direction, buttonIsDown) {
    if (!this.started) return;
    const controlName = direction === 'LEFT' ? this.controls.moveLeft : this.controls.moveRight;
    const otherControlName = direction === 'LEFT' ? this.controls.moveRight : this.controls.moveLeft;
    const otherDirection = direction === 'LEFT' ? 'RIGHT' : 'LEFT';
    const move = direction === 'LEFT' ? this.tc.moveLeft.bind(this.tc) : this.tc.moveRight.bind(this.tc);
    if (buttonIsDown) {
      this.isMoving = true;
      move();
      clearInterval(this.controlLatches[direction]);
      clearInterval(this.controlLatches[otherDirection]);
      if (this.controller.controlState[controlName]) {
        this.controlLatches[direction] = setInterval(() => {
          move();
        }, LATCH_INTERVAL);
      }
    } else {
      clearInterval(this.controlLatches[direction]);
      if (this.controller.controlState[otherControlName]) {
        this.handleSideControl(otherDirection, true);
      }
    }
  }

  handleRotateControl(buttonIsDown) {
    if (!this.started) return;
    if (buttonIsDown) {
      this.tc.rotate();
    }
  }

  handleDropControl(buttonIsDown) {
    if (!this.started) return;
    if (buttonIsDown) {
      clearInterval(this.controlLatches.DOWN);
      this.tc.moveDown();
      this.controlLatches.DOWN = setInterval(() => {
        this.tc.moveDown();
      }, LATCH_INTERVAL);
    } else {
      clearInterval(this.controlLatches.DOWN);
    }
  }


  attachControls() {
    this.controlLatches = {};
    this.controller.on(this.controls.moveLeft, this.handleSideControl.bind(this, 'LEFT'));
    this.controller.on(this.controls.moveRight, this.handleSideControl.bind(this, 'RIGHT'));
    this.controller.on(this.controls.rotate, this.handleRotateControl.bind(this));
    this.controller.on(this.controls.drop, this.handleDropControl.bind(this));
    this.controller.on(this.controls.start, this.start.bind(this));
  }
}

module.exports = Tetris;


const c = new Controller({
  width: 26,
  height: 19,
  controls: [
    {
      name: 'LEFT-1', type: 'BUTTON', debugKey: 'ArrowLeft', debugLabel: 'LEFT-1',
    },
    {
      name: 'RIGHT-1', type: 'BUTTON', debugKey: 'ArrowRight', debugLabel: 'RIGHT-1',
    },
    {
      name: 'ROTATE-1', type: 'BUTTON', debugKey: 'ArrowUp', debugLabel: 'ROTATE-1',
    },
    {
      name: 'DOWN-1', type: 'BUTTON', debugKey: 'ArrowDown', debugLabel: 'DOWN-1',
    },
    {
      name: 'START-1', type: 'BUTTON', debugKey: 'S', debugLabel: 'START-1',
    },
    {
      name: 'LEFT-2', type: 'BUTTON', debugKey: 'ArrowLeft', debugLabel: 'LEFT-2',
    },
    {
      name: 'RIGHT-2', type: 'BUTTON', debugKey: 'ArrowRight', debugLabel: 'RIGHT-2',
    },
    {
      name: 'ROTATE-2', type: 'BUTTON', debugKey: 'ArrowUp', debugLabel: 'ROTATE-2',
    },
    {
      name: 'DOWN-2', type: 'BUTTON', debugKey: 'ArrowDown', debugLabel: 'DOWN-2',
    },
    {
      name: 'START-2', type: 'BUTTON', debugKey: 'S', debugLabel: 'START-2',
    },
  ],
});

const t1 = new Tetris({
  controls: {
    moveLeft: 'LEFT-1', moveRight: 'RIGHT-1', rotate: 'ROTATE-1', drop: 'DOWN-1', start: 'START-1',
  },
  width: 12,
  height: 19,
  controller: c,
  origin: [0, 0],
});

const t2 = new Tetris({
  controls: {
    moveLeft: 'LEFT-2', moveRight: 'RIGHT-2', rotate: 'ROTATE-2', drop: 'DOWN-2', start: 'START-2',
  },
  width: 12,
  height: 19,
  controller: c,
  origin: [14, 0],
});

setInterval(() => {
  c.draw();
}, 500);
