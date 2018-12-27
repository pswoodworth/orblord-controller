const Controller = require('../OrbLordController');
const translateController = require('../translateController');
const { Shape } = require('../OrbLordCanvas');
const CommandQueue = require('../CommandQueue');

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
    {
      name: 'D', type: 'BUTTON', debugKey: 'd', debugLabel: 'Remove Point at 3,1',
    },
    {
      name: 'A', type: 'BUTTON', debugKey: 'a', debugLabel: 'Add Point at 3,1',
    },
    {
      name: 'I', type: 'BUTTON', debugKey: 'i', debugLabel: 'Check intersection',
    },
    {
      name: 'R', type: 'BUTTON', debugKey: 'r', debugLabel: 'Rotate 90',
    },
    {
      name: 'E', type: 'BUTTON', debugKey: 'e', debugLabel: 'Rotate 90 - s2',
    },
  ],
});

const lord = translateController(c, [3, 3]);

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
      case 'D':
        s.removePointAtPosition([3, 1]);
        break;
      case 'A':
        s.addPointAtPosition([3, 1]);
        break;
      case 'I':
        console.log(s.getIntersectionPosition(s2));
        break;
      case 'R':
        s.rotate(90);
        break;
      case 'E':
        s2.rotate(90);
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
