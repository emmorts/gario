var OPCode = require('opCode');

export { default as Primary } from 'client/spells/Primary';

export function get(code) {
  var spell = null;

  switch (code) {
    case OPCode.SPELL_PRIMARY:
      spell = module.exports.Primary;
      break;
  }

  return spell;
}