const spells = require('client/spells');

class SpellFactory {

  static instantiate(type) {
    if (spells) {
      const args = Array.prototype.slice.call(arguments, 1);
      const Spell = spells[type];

      if (Spell) {
        return new Spell(...args);
      }
    }

    return null;
  }

}

module.exports = SpellFactory;
