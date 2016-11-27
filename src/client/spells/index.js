const OPCode = require('common/opCode');

module.exports = {
  [OPCode.SPELL_PRIMARY]: require('client/spells/PrimarySpell'),
  [OPCode.SPELL_HOMING]: require('client/spells/HomingSpell'),
};
