const Action = require('server/actions/Action');
const OPCode = require('common/opCode');

class Pong extends Action {

  constructor() {
    super(OPCode.PONG, ...arguments);
  }

  execute() {
    this.socket.packetHandler.ping();
  }

}

module.exports = Pong;
