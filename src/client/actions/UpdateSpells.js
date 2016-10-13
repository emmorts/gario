const Action = require('client/actions/Action');
const OPCode = require('opCode');

class UpdateSpells extends Action {

  constructor() {
    super(OPCode.UPDATE_SPELLS);
  }

  static get eventName() {
    return 'updateSpells';
  }

}

module.exports = UpdateSpells;