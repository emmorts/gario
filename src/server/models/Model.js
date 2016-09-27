const OPCode = require('../../opCode');

class Model {

  constructor() {
    this.id = -1;
    this.owner = null;
    this.type = OPCode.TYPE_MODEL;
  }

  calculateNextPosition() {}
  setColor() {}
  onAdd() {}
  
}

module.exports = Model;