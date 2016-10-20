const Action = require('client/actions/Action');
const OPCode = require('common/opCode');

class CastSpell extends Action {

  constructor() {
    super(OPCode.CAST_SPELL);
  }

  build(object) {
    if (this.actionSchema) {
      return this.actionSchema.encode(object);
    }

    return null;
  }

}

module.exports = CastSpell;