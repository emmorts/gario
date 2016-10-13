const Action = require('actions/Action');
const OPCode = require('shared/opCode');

class PlayerMove extends Action {

  constructor() {
    super(OPCode.PLAYER_MOVE);
  }
  
}

module.exports = PlayerMove;