const OPCode = require('../../opCode');

module.exports = {
  [OPCode.TYPE_MODEL]: require('./ModelFactory'),
  [OPCode.TYPE_SPELL]: require('./SpellFactory')
};