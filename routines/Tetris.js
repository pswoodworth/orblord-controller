const Controller = require('../OrbLordController');
// const translateController = require('../translateController');
// const { Shape, Rectangle } = require('../OrbLordCanvas');
// const CommandQueue = require('../CommandQueue');

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

const cmd = c.on('LEFT', (val) => { console.log(val); });

setTimeout(() => { c.off(cmd); }, 5000);

// class Tetris {
//   constructor({
//     // controls: {
//     //   moveLeft, moveRight, rotate, drop,
//     // }, width, height, controller,
//   }) {
//     this.controls = {
//       moveLeft, moveRight, rotate, drop,
//     };
//     this.width = width || controller.width;
//     this.height = height || controller.height;
//     this.controller = controller;
//     // this.controller.registerCommandQueue(this.commandQueue);
//   }
//
//   createBoundaries() {
//     // this.boundaries = [
//     //   new Rectangle({ topLeft: [0, 0], bottomRight: [0, this.height - 1] }), // LEFT
//     //   new Rectangle({ topLeft: [0, 0], bottomRight: [this.width - 1, 0] }), // TOP
//     //   new Rectangle({ topLeft: [this.width - 1, 0], bottomRight: [this.width - 1, this.height - 1] }), // RIGHT
//     //   new Rectangle({ topLeft: [0, this.height - 1], bottomRight: [this.width - 1, this.height - 1] }), // BOTTOM
//     // ];
//   }
//
//   advanceActivePiece() {
//
//   }
//
//   draw() {
//
//   }
// }
//
// module.exports = Tetris;
//
// const s = new Shape({
//   fillColor: [255, 255, 255],
//   points: [[0, 0], [0, 1], [0, 2], [0, 3]],
//   position: [2, 2],
//   // rotation: 90,
//   // rotationOrigin: [0, 0],
// });
//
// const s2 = new Shape({
//   fillColor: [255, 0, 0],
//   points: [[0, 0], [0, 1], [1, 1]],
//   position: [3, 1],
// });
//
//
function loop() {
  c.draw();
}


setInterval(loop, 20);
