const Action = require('actions/Action');
const OPCode = require('shared/opCode');

class CastSpell extends Action {

  constructor() {
    super(OPCode.CAST_SPELL);
  }
  
}

module.exports = CastSpell;