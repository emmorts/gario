const Action = require('client/actions/Action');
const OPCode = require('common/opCode');

class Collision extends Action {

  static get eventName() {
    return 'collision';
  }

  constructor() {
    super(OPCode.COLLISION);
  }

}

module.exports = Collision;