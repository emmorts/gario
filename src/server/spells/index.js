const OPCode = require('opCode');

module.exports = {
  [OPCode.SPELL_PRIMARY]: require('server/spells/Primary')
};