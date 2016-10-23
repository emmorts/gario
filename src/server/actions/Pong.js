const Action = require('server/actions/Action');
const OPCode = require('common/opCode');

class Pong extends Action {

  constructor() {
    super(OPCode.PONG, ...arguments);
  }

  execute(buffer) {
    const target = this.parse(buffer);

    this.socket.packetHandler.ping();
  }

}

module.exports = Pong;