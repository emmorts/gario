const Action = require('server/actions/Action');
const OPCode = require('opCode');

class Collision extends Action {

  constructor() {
    super(OPCode.COLLISION, ...arguments);
  }

  execute(buffer) {
    const collision = this.parse(buffer);

    return collision;
  }

}

module.exports = Collision;