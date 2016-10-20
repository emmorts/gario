const Action = require('server/actions/Action');
const OPCode = require('common/opCode');

class Collision extends Action {

  constructor() {
    super(OPCode.COLLISION, ...arguments);
  }

  execute(buffer) {
    return this.parse(buffer);
  }

}

module.exports = Collision;