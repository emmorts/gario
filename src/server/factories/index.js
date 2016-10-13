const OPCode = require('../../opCode');

module.exports = {
  [OPCode.TYPE_MODEL]: require('factories/ModelFactory'),
  [OPCode.TYPE_SPELL]: require('factories/SpellFactory')
};