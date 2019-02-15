const Controller = require('../OrbLordController');
// const translateController = require('../translateController');
const { Shape, Rectangle } = require('../OrbLordCanvas');
const { cloneDeep } = require('lodash');
// const CommandQueue = require('../CommandQueue');

const PIECES = [
  [[0, -3], [0, -2], [0, -1], [0, 0]],
  [[-1, -1], [0, -1], [0, 0], [1, 0]],
  [[0, -1], [1, -1], [-1, 0], [0, 0]],
  [[0, -2], [0, -1], [0, 0], [1, 0]],
  [[0, -1], [1, -1], [0, 0], [1, 0]],
];

const COLORS = [
  [255, 0, 0],
  [0, 255, 0],
  [125, 125, 255],
];

const LATCH_INTERVAL = 180;
const LATCH_PAUSE = 220;

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

    this.dockedPieces = [];
  }

  createBoundaries() {
    this.boundaries = [
      new Rectangle({ topLeft: [0, 0], bottomRight: [0, this.height - 1] }), // LEFT
      new Rectangle({ topLeft: [0, 0], bottomRight: [this.width - 1, 0] }), // TOP
      new Rectangle({ topLeft: [this.width - 1, 0], bottomRight: [this.width - 1, this.height - 1] }), // RIGHT
      new Rectangle({ topLeft: [0, this.height - 1], bottomRight: [this.width - 1, this.height - 1] }), // BOTTOM
    ];
  }

  createClearLines() {
    this.clearLines = [
      // create invisible shapes to check fo interspection
    ];
  }

  createNewActivePiece() {
    const points = PIECES[Math.floor(Math.random() * PIECES.length)];
    const fillColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const position = [Math.floor(this.width / 2), 0];
    this.activePiece = new Shape({ fillColor, points, position });
  }

  advanceActivePiece() {
    this.activePiece.moveDown(1);
  }

  draw() {
    this.controller.clear();
    this.controller.shapes(this.dockedPieces);
    if (this.activePiece) {
      this.controller.shape(this.activePiece);
    }
    this.controller.draw();
  }

  moveActivePieceSideways(direction) {
    const movement = direction === 'LEFT' ? [-1, 0] : [1, 0];
    const clone = cloneDeep(this.activePiece);
    clone.move(...movement);
    if (!clone.intersectsPosition(this.boundaries)) {
      this.activePiece.move(...movement);
    } else {
      console.log('collision!');
    }
  }

  start() {
    this.createBoundaries();
    this.attachControls();
    this.createNewActivePiece();
    setInterval(() => {
      this.draw();
    }, 20);
    setInterval(() => {
      this.advanceActivePiece();
    }, 750);
  }

  handleSideControl(direction, buttonIsDown) {
    const controlName = direction === 'LEFT' ? this.controls.moveLeft : this.controls.moveRight;
    const otherControlName = direction === 'LEFT' ? this.controls.moveRight : this.controls.moveLeft;
    const otherDirection = direction === 'LEFT' ? 'RIGHT' : 'LEFT';
    if (buttonIsDown) {
      this.isMoving = true;
      this.moveActivePieceSideways(direction);
      clearInterval(this.controllerLatches[otherDirection]);
      setTimeout(() => {
        if (this.controller.controlState[controlName]) {
          this.controllerLatches[direction] = setInterval(() => {
            this.moveActivePieceSideways(direction);
          }, LATCH_INTERVAL);
        }
      }, LATCH_PAUSE);
    } else {
      clearInterval(this.controllerLatches[direction]);
      if (this.controller.controlState[otherControlName]) {
        this.handleSideControl(otherDirection, true);
      }
    }
  }


  attachControls() {
    this.controllerLatches = {};
    this.controller.on(this.controls.moveLeft, this.handleSideControl.bind(this, 'LEFT'));
    this.controller.on(this.controls.moveRight, this.handleSideControl.bind(this, 'RIGHT'));
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
  width: 10,
  height: 18,
  controller: c,
});

t.start();
