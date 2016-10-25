const spells = require('client/spells');

class SpellFactory {

  static instantiate(type) {
    if (spells) {
      const args = Array.prototype.slice.call(arguments, 1);
      const spell = spells[type];

      if (spell) {
        return new spell(...args);
      }
    }

    return null;
  }

}

module.exports = SpellFactory;