const Action = require('client/actions/Action');
const OPCode = require('opCode');

class UpdateSpells extends Action {

  static get eventName() {
    return 'updateSpells';
  }

  constructor() {
    super(OPCode.UPDATE_SPELLS);
  }

  execute(buffer) {
    return this.parse(buffer);
  }

}

module.exports = UpdateSpells;