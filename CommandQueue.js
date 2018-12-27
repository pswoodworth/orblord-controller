class CommandQueue {
  constructor(controls = []) {
    this.controls = controls;
    this.commands = [];
  }

  popCommands() {
    const commands = [].concat(this.commands);
    this.commands = [];
    return commands;
  }

  pushCommand(command) {
    if (this.controls.length === 0 || this.controls.includes(command.control)) {
      this.commands.push(command);
    }
  }
}


module.exports = CommandQueue;
