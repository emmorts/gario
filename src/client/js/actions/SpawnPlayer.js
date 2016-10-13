const Action = require('actions/Action');
const OPCode = require('shared/opCode');

class SpawnPlayer extends Action {

  constructor() {
    super(OPCode.SPAWN_PLAYER);
  }
  
}

module.exports = SpawnPlayer;