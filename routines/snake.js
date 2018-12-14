const Controller = require('../OrbLordController');

const lord = new Controller();


var state = {}

function addSnakeCoordinate([x,y]){
  state.snakePosition.push(`${x}-${y}`)
  console.log('STATE AFTER PUSH', state);
}

function getSnakeHead(){
  return state.snakePosition[state.snakePosition.length - 1].split('-').map(i=>Number(i));
}

function setSnakeDirection(direction){
  state.snakeDirection = direction
}

function dropFood(){
  state.foodPosition = [Math.floor(Math.random()*10), Math.floor(Math.random()*17)]
}

function init(){
  console.log('init')
  state = {
    snakePosition: ['3-12', '3-11', '3-10'],
    foodPosition: [],
    snakeDirection: 'UP',
    snakeShouldGrow: false,
    score: 0
  }
  dropFood()
  // setSnakeDirection('UP')
}

function arePointsEqual(p1, p2){
  return p1[0] === p2[0] && p1[1] === p2[1]
}

function advanceSnake(){
  const nextSnakeHead = getNextSnakeHead();
  console.log('NEXT SNAKE HEAD RESULT', nextSnakeHead);
  if ( state.snakePosition.includes(`${nextSnakeHead[0]}-${nextSnakeHead[1]}`)){
    // we lost
    init();
    return
  }

  const foodPosition = state.foodPosition;
  addSnakeCoordinate(nextSnakeHead);
  if ( arePointsEqual(nextSnakeHead, foodPosition) ){
    state.score = state.score + 1;
    dropFood();
  }else{
    state.snakePosition.shift();
  }


}

function getNextSnakeHead(){
  let [x, y] = getSnakeHead();
  console.log('CURRENT SNAKE HEAD', x,y);
  console.log('DIRECTION', state.snakeDirection);
  if(state.snakeDirection === 'LEFT'){
    x = x === 0 ? 10 : x - 1;
  }else if(state.snakeDirection === 'RIGHT'){
    x = x === 10 ? 0 : x + 1;
  }else if(state.snakeDirection === 'DOWN'){
    y = y === 17 ? 0 : y +1;
  }else if(state.snakeDirection === 'UP'){
    y = y === 0 ? 17 : y - 1;
  }
  console.log('NEXT SNAKE HEAD', x,y);
  return [x, y]
}

function areDirectionsOpposite(dir1, dir2){
  return (dir1 === 'UP' && dir2 === 'DOWN') ||
    (dir2 === 'UP' && dir1 === 'DOWN') ||
    (dir1 === 'LEFT' && dir2 === 'RIGHT') ||
    (dir1 === 'RIGHT' && dir2 === 'LEFT');
}

function getNewSnakeDirection(newCommand){
  if(!newCommand) return state.snakeDirection;
  if(areDirectionsOpposite(newCommand, state.snakeDirection)){
    return state.snakeDirection
  }else{
    return newCommand;
  }
}

function loop(){

  const command = lord.popCommands().pop();
  state.snakeDirection = getNewSnakeDirection(command);

  advanceSnake();

  const snakeCoordinates = state.snakePosition.map(point => point.split('-').map(i => Number(i)).concat([255,255,255]))
  lord.clear();
  lord.points(snakeCoordinates);
  lord.point(state.foodPosition[0], state.foodPosition[1], 255, 0, 0);
  lord.draw();
}

init();
setInterval(loop, 500);
