const Action = require('client/actions/Action');
const OPCode = require('opCode');

class PlayerMove extends Action {

  constructor() {
    super(OPCode.PLAYER_MOVE);
  }

}

module.exports = PlayerMove;