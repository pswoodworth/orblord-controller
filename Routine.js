class Routine {
  constructor() {
    this.previousCommandQueue = [];
    this.commandQueue = [];
  }

  addCommandToQueue(command) {
    this.commandQueue.push(command);
  }

  popCommands() {
    this.previousCommandQueue = [].concat(this.commandQueue);
    this.commandQueue = [];
    return commands;
  }


  start() {
    console.warn('start() not set up!');
  }

  stop() {
    console.warn('stop() not set up!');
  }
}

module.exports = Routine;
