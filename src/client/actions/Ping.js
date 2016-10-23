const Action = require('client/actions/Action');
const OPCode = require('common/opCode');

class Ping extends Action {

  static get eventName() {
    return 'ping';
  }

  constructor() {
    super(OPCode.PING);
  }

}

module.exports = Ping;