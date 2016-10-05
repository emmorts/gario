const OPCode = require('../../opCode');

class Model {
  constructor() {
    this.id = -1;
    this.owner = null;
    this.type = null;
  }

  calculateNextPosition() {};
  setColor() {};
  onAdd() {};
}

module.exports = Model;