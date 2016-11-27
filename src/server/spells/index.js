const OPCode = require('common/opCode');

module.exports = {
  [OPCode.SPELL_PRIMARY]: require('server/spells/PrimarySpell'),
  [OPCode.SPELL_HOMING]: require('server/spells/HomingSpell'),
};
