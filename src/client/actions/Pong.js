const Action = require('client/actions/Action');
const OPCode = require('common/opCode');

class Pong extends Action {

  static get eventName() {
    return 'pong';
  }

  constructor() {
    super(OPCode.PONG);
  }

}

module.exports = Pong;