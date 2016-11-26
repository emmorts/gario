const Action = require('server/actions/Action');
const OPCode = require('common/opCode');

class SpawnPlayer extends Action {

  constructor() {
    super(OPCode.SPAWN_PLAYER, ...arguments);
  }

  execute(buffer) {
    const object = this.parse(buffer);

    this.socket.playerController.spawn(object);
  }

}

module.exports = SpawnPlayer;
