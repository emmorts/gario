const OPCode = require('common/opCode');

module.exports = {
  [OPCode.TYPE_MAP]: require('client/factories/MapFactory'),
  [OPCode.TYPE_MODEL]: require('client/factories/ModelFactory'),
  [OPCode.TYPE_SPELL]: require('client/factories/SpellFactory'),
};
