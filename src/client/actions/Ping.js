const Action = require('client/actions/Action');
const OPCode = require('common/opCode');

class Ping extends Action {

  constructor() {
    super(OPCode.PING);
  }

  static get eventName() {
    return 'ping';
  }

}

module.exports = Ping;
