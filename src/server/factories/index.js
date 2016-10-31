const OPCode = require('common/opCode');

module.exports = {
  [OPCode.TYPE_MODEL]: require('server/factories/ModelFactory'),
  [OPCode.TYPE_SPELL]: require('server/factories/SpellFactory'),
};
