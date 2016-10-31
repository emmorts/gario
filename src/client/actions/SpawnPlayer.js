const Action = require('client/actions/Action');
const OPCode = require('common/opCode');

class SpawnPlayer extends Action {

  constructor() {
    super(OPCode.SPAWN_PLAYER);
  }

  static get eventName() {
    return 'spawnPlayer';
  }

}

module.exports = SpawnPlayer;
