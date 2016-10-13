const Action = require('actions/Action');
const OPCode = require('../../opCode');

let instance = null;

class CastSpell extends Action {

  constructor() {
    if (instance) return instance;

    super(OPCode.CAST_SPELL, ...arguments);

    instance = this;
  }

  execute(buffer) {
    const spell = this.parse(buffer);

    this.socket.playerController.cast(spell);
  }
  
}

module.exports = CastSpell;