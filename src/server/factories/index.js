const OPCode = require('../../opCode');

module.exports = {
  [OPCode.TYPE_SPELL]: require('./SpellFactory')
};