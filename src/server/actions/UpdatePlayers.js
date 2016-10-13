const Action = require('actions/Action');
const OPCode = require('../../opCode');

let instance = null;

class UpdatePlayers extends Action {

  constructor() {
    if (instance) return instance;

    super(OPCode.UPDATE_PLAYERS, ...arguments);

    instance = this;
  }

  build(object) {
    if (this.actionSchema) {
      return this.actionSchema.encode(object);
    }

    return null;
  }
  
}

module.exports = UpdatePlayers;