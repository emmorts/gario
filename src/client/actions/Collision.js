const Action = require('client/actions/Action');
const OPCode = require('common/opCode');

class Collision extends Action {

  constructor() {
    super(OPCode.COLLISION);
  }

  static get eventName() {
    return 'collision';
  }

}

module.exports = Collision;
