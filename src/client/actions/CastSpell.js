const Action = require('client/actions/Action');
const OPCode = require('opCode');

class CastSpell extends Action {

  constructor() {
    super(OPCode.CAST_SPELL);
  }

}

module.exports = CastSpell;