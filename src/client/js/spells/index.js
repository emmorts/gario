var OPCode = require('../../../opCode');

module.exports = {
  Primary: require('./Primary')
}

module.exports.get = function (code) {
  var spell = null;
  
  switch (code) {
    case OPCode.SPELL_PRIMARY:
      spell = module.exports.Primary;
      break;
  }
  
  return spell;
}