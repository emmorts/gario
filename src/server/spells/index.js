const OPCode = require('common/opCode');

module.exports = {
  [OPCode.SPELL_PRIMARY]: require('server/spells/Primary')
};