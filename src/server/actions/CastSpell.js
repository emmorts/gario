const Action = require('server/actions/Action');
const OPCode = require('opCode');

class CastSpell extends Action {

  constructor() {
    super(OPCode.CAST_SPELL, ...arguments);
  }

  execute(buffer) {
    const spell = this.parse(buffer);

    this.socket.playerController.cast(spell);
  }

}

module.exports = CastSpell;