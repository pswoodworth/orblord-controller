const Controller = require('../OrbLordController');
const lord = new Controller();

const gridHeight = 18;
const gridWidth = 11;


var occupiedLocations = new Map();
var snakeLocations = [
  {x: 3, y: 0},
  {x: 3, y: 1},
  {x: 3, y: 2}
];
var snakeDirection = "DOWN";
var foodLocation = {x: 5, y: 7};

function coordinateToString(coord) {
  let x = coord.x; let y = coord.y;
  let id = x.toString() + "," + y.toString()

  return id;
}

function updateDisplay() {
  Array(gridHeight).fill().forEach((_, yValue) => {
    var builder = "";

    Array(gridWidth).fill().forEach((_, xValue) => {
      let coordinate = {x: xValue, y: yValue};
      let stringValue = coordinateToString(coordinate);

      var toPrint = "-";

      if (occupiedLocations.has(stringValue)) {
        toPrint = "X"
      } else if (foodLocation.x === coordinate.x && foodLocation.y === coordinate.y) {
        toPrint = "F";
      }

      builder += toPrint + " ";
    })
    console.log(builder);
  })

  console.log("\n\n\n\n\n");
}

function nextCommand() {

  if (commands.length > 0) {
    return commands.shift()
  } else {
    return null;
  }
}

function dirIsOppositeOf(dir, cmd) {
  switch (cmd) {
    case "LEFT":
      return dir === "RIGHT";
    case "RIGHT":
      return dir === "LEFT";
    case "DOWN":
      return dir === "UP";
    case "UP":
      return dir === "DOWN";
  }
}

function shouldRunCommand(cmd) {
  if (cmd == snakeDirection) {
    return false;
  } else if (dirIsOppositeOf(snakeDirection, cmd)) {
    return false
  } else {
    return true
  }
}

function nextCoordinateForDirection(dir, headCoord) {
  var nextX = headCoord.x;
  var nextY = headCoord.y;

  switch (dir) {
    case "LEFT":
      nextX -= 1;
      break;
    case "RIGHT":
      nextX += 1;
      break;
    case "DOWN":
      nextY +=1;
      break;
    case "UP":
      nextY -=1;
      break;
  }

  if (nextX == -1) {
    nextX = gridWidth - 1
  } else if (nextX == gridWidth) {
    nextX = 0
  }

  if (nextY == -1) {
    nextY = gridHeight - 1
  } else if (nextY == gridHeight) {
    nextY = 0
  }

  return {x: nextX, y: nextY};
}

function run() {
  const command = lord.popCommands().pop();

  if (command != null && shouldRunCommand(command)) {
    snakeDirection = command
  }

  snakeLocations.shift()
  snakeLocations.push(nextCoordinateForDirection(snakeDirection, snakeLocations[snakeLocations.length - 1]));

  occupiedLocations.clear()
  snakeLocations.forEach((item, _) => {
    let id = coordinateToString(item)

    occupiedLocations.set(id, item);
  })

  // updateDisplay()
  // return snakeLocations;
  lord.clear()
  const log = snakeLocations.map(point => [point.x, point.y, 255, 255, 255])
  console.log(log);
  lord.points(log)
  const log2 = [foodLocation.x, foodLocation.y, 255, 0, 0]
  console.log(log2)
  // lord.point(log2)
  lord.draw()
}

setInterval(run, 500)

// var offset = 0
// while(true) {
//   offset += 1
//   if (offset > 1000000000) {
//     offset = 0
//     run()
//   }
// }
