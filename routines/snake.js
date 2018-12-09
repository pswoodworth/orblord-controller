const Controller = require('../OrbLordController');

const lord = new Controller();


let state = {}

function addSnakeCoordinate(x,y){
  state.snakePosition.push(`${x}-${y}`)
}

function getSnakeHead(){
  return state.snakePosition[state.snakePosition.length - 1].split('-');
}

function setSnakeDirection(direction){
  state.snakeDirection = direction
}

function dropFood(){
  state.foodPosition = [Math.floor(Math.random()*10), Math.floor(Math.random()*17))]
}

function init(){
  state = {
    snakePosition: [],
    foodPosition: [],
    snakeDirection: '',
    snakeShouldGrow: false
  }
  addSnakeCoordinate(5,10)
  addSnakeCoordinate(4,10)
  addSnakeCoordinate(3,10)
  dropFood()
  setSnakeDirection('UP')
}

function arePointsEqual(p1, p2){
  return p1[0] === p2[0] && p1[1] === p2[1]
}

function advanceSnake(){
  const nextSnakeHead = getNextSnakeHead();
  const foodPosition = state.foodPosition;
  addSnakeCoordinate(nextSnakeHead);
  if ( !arePointsEqual(nextSnakeHead, foodPosition) ){
      snakePosition.pop()
  }

}

function getNextSnakeHead(){
  let [x, y] = getSnakeHead();
  if(state.snakeDirection === 'LEFT'){
    x = x === 0 ? 10 : x - 1;
  }else if(state.snakeDirection === 'RIGHT'){
    x = x === 10 ? 0 : x + 1;
  }else if(state.snakeDirection === 'DOWN'){
    y = y === 17 ? 0 : y +1;
  }else if(state.snakeDirection === 'UP'){
    y = y === 0 ? 17 : y - 1;
  }
  return [x, y]
}

function loop(){

  const command = lord.popCommands().pop();



  // lord.clear();
  lord.point(state.x, state.y, 0, 255, 0);
  lord.draw();
}

setInterval(loop, 10);
