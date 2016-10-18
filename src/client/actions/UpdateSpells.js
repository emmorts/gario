const Action = require('client/actions/Action');
const OPCode = require('opCode');

class UpdateSpells extends Action {

  static get eventName() {
    return 'updateSpells';
  }

  constructor() {
    super(OPCode.UPDATE_SPELLS);
  }

}

module.exports = UpdateSpells;