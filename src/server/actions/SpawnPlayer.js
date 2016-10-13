const Action = require('actions/Action');
const OPCode = require('../../opCode');

let instance = null;

class SpawnPlayer extends Action {

  constructor() {
    if (instance) return instance;

    super(OPCode.SPAWN_PLAYER, ...arguments);

    instance = this;
  }

  execute(buffer) {
    const object = this.parse(buffer);
    
    this.socket.playerController.spawn(object);
  }
  
}

module.exports = SpawnPlayer;