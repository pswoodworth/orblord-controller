const Controller = require('../OrbLordController');
const translateController = require('../translateController');
const { Shape } = require('../OrbLordCanvas');
const CommandQueue = require('../CommandQueue');

const lord = new Controller({
  width: 26,
  height: 19,
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


const commandQueue = new CommandQueue();

lord.registerCommandQueue(commandQueue);


const s = new Shape({
  fillColor: [255, 255, 255],
  points: [[0, 0], [0, 1], [0, 2], [0, 3]],
  position: [2, 2],
  // rotation: 90,
  // rotationOrigin: [0, 0],
});

const s2 = new Shape({
  fillColor: [255, 0, 0],
  points: [[0, 0], [0, 1], [1, 1]],
  position: [3, 1],
});


function loop() {
  const command = commandQueue.popCommands().pop();
  if (command && command.state === 'DOWN') {
    switch (command.control) {
      case 'LEFT':
        s.moveLeft(1);
        break;
      case 'RIGHT':
        s.moveRight(1);
        break;
      case 'UP':
        s.moveUp(1);
        break;
      case 'DOWN':
        s.moveDown(1);
        break;
      default:
        break;
    }
  }

  lord.clear();
  lord.shape(s);
  lord.shape(s2);
  lord.draw();
}

setInterval(loop, 20);
