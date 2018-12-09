const Controller = require('../OrbLordController');

const lord = new Controller();


let state = {
  x: 0,
  y: 0
}

function loop(){

  const command = lord.popCommands().pop();

  if(command === 'LEFT'){
    state.x = state.x === 0 ? 0 : state.x - 1;
  }else if(command === 'RIGHT'){
    state.x = state.x === 10 ? 10 : state.x + 1;
  }else if(command === 'DOWN'){
    state.y = state.y === 17 ? 17 : state.y +1;
  }else if(command === 'UP'){
    state.y = state.y === 0 ? 0 : state.y - 1;
  }

  // lord.clear();
  lord.point(state.x, state.y, 0, 255, 0);
  lord.draw();
}

setInterval(loop, 10);
