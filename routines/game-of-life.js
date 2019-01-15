const Controller = require('../OrbLordController');
const { Shape } = require('../OrbLordCanvas');
const GameOfLife = require('game-of-life-logic');

const lord = new Controller({
  width: 26,
  height: 19,
});

let game;
let count = 0;

function initGame() {
  game = new GameOfLife(26, 19);
  const newMatrix = [].concat(game.matrix);
  // console.log(newMatrix);
  for (let i = 0; i < 300; i += 1) {
    const x = Math.round(Math.random() * 25);
    const y = Math.round(Math.random() * 18);
    newMatrix[y][x] = 1;
  }
  game.copyMatrixAt(1, 1, newMatrix);
}


const s = new Shape({
  fillColor: [125, 125, 255],
  points: [[0, 0]],
  position: [0, 0],
});


function loop() {
  if (count === 0) {
    initGame();
  }
  count = (count + 1) % 200;
  game.tick();

  const newPoints = game.matrix.reduce((result, row, Y) => {
    const nextResult = [].concat(result);
    row.forEach((item, X) => {
      if (item === 1) {
        nextResult.push([X, Y]);
      }
    });
    return nextResult;
  }, []);

  const newColor = [Math.abs(Math.sin(newPoints.length)) * 255, Math.abs(Math.cos(newPoints.length)) * 255, Math.abs(Math.sin(newPoints.length * 1.2)) * 255];

  s.set({
    points: newPoints,
    fillColor: newColor,
  });
  lord.clear();
  lord.shape(s);
  lord.draw();
}

setInterval(loop, 1000);
