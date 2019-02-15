const TetrisCore = require('./TetrisCore').default;
const tetrisOptions = require('./tetris-core-options');
const Controller = require('../OrbLordController');
const hexRgb = require('hex-rgb');

// const translateController = require('../translateController');

const LATCH_INTERVAL = 200;
const LATCH_PAUSE = 250;

class Tetris {
  constructor({
    controls: {
      moveLeft, moveRight, rotate, drop,
    }, width, height, controller,
  }) {
    this.controls = {
      moveLeft, moveRight, rotate, drop,
    };
    this.width = width || controller.width;
    this.height = height || controller.height;
    this.controller = controller;
    this.tc = new TetrisCore(tetrisOptions({ width: this.width, height: this.height }));
    this.tc.on('render', ({
      stage, score, speed, nextBlock, display,
    }) => {
      // stage ==> number
      // score ==> number
      // speed ==> number
      // nextBlock ==> two dimensional array (0 or block hex color code)
      // display ==> two dimensional array (0 or block hex color code)
      // console.log(display);
      this.controller.clear();
      if (display) {
        display.forEach((row, y) => {
          row.forEach((color, x) => {
            if (color) {
              const rgbColor = hexRgb(color);
              this.controller.point([x, y], [rgbColor.red, rgbColor.green, rgbColor.blue]);
            }
          });
        });
      }
      this.controller.draw();
    });
  }


  draw() {
    this.controller.clear();
    this.controller.shapes(this.dockedPieces);
    if (this.activePiece) {
      this.controller.shape(this.activePiece);
    }
    this.controller.draw();
  }


  start() {
    this.attachControls();
    this.tc.start();
  }

  handleSideControl(direction, buttonIsDown) {
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
    if (buttonIsDown) {
      this.tc.rotate();
    }
  }

  handleDropControl(buttonIsDown) {
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
  }
}

module.exports = Tetris;


const c = new Controller({
  width: 11,
  height: 18,
  controls: [
    {
      name: 'LEFT', type: 'BUTTON', debugKey: 'ArrowLeft', debugLabel: 'LEFT',
    },
    {
      name: 'RIGHT', type: 'BUTTON', debugKey: 'ArrowRight', debugLabel: 'RIGHT',
    },
    {
      name: 'UP', type: 'BUTTON', debugKey: 'ArrowUp', debugLabel: 'UP',
    },
    {
      name: 'DOWN', type: 'BUTTON', debugKey: 'ArrowDown', debugLabel: 'DOWN',
    },
  ],
});

const t = new Tetris({
  controls: {
    moveLeft: 'LEFT', moveRight: 'RIGHT', rotate: 'UP', drop: 'DOWN',
  },
  width: 11,
  height: 18,
  controller: c,
});

t.start();
