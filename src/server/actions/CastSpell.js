const Action = require('server/actions/Action');
const OPCode = require('common/opCode');

class CastSpell extends Action {

  static get eventName() {
    return 'castSpell';
  }

  constructor() {
    super(OPCode.CAST_SPELL, ...arguments);
  }

  execute(buffer) {
    const spell = this.parse(buffer);

    this.socket.playerController.cast(spell);

    return spell;
  }

}

module.exports = CastSpell;
