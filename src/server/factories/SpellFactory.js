const spells = require('server/spells');
const Logger = require('server/Logger');
const OPCode = require('common/opCode');

class SpellFactory {

  static instantiate(type) {
    if (spells) {
      const args = Array.prototype.slice.call(arguments, 1);
      const Spell = spells[type];

      if (!Spell) {
        Logger.error(`Spell for '${OPCode.getName(type)}' was not found.`);
      } else {
        return new Spell(...args);
      }
    }

    return null;
  }

}

module.exports = SpellFactory;
