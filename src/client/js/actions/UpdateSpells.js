const Action = require('actions/Action');
const OPCode = require('shared/opCode');

class UpdateSpells extends Action {

  constructor() {
    super(OPCode.UPDATE_SPELLS);
  }

  static get eventName() {
    return 'updateSpells';
  }
  
}

module.exports = UpdateSpells;