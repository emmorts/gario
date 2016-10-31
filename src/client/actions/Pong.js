const Action = require('client/actions/Action');
const OPCode = require('common/opCode');

class Pong extends Action {

  constructor() {
    super(OPCode.PONG);
  }

  static get eventName() {
    return 'pong';
  }

}

module.exports = Pong;
