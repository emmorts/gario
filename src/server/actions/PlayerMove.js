const Action = require('server/actions/Action');
const OPCode = require('opCode');

class PlayerMove extends Action {

  constructor() {
    super(OPCode.PLAYER_MOVE, ...arguments);
  }

  execute(buffer) {
    const target = this.parse(buffer);

    this.socket.playerController.setTarget(target);
  }

}

module.exports = PlayerMove;