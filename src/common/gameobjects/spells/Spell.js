const GameObject = require('common/GameObject');

class Spell extends GameObject {
  constructor() {
    super();

    this.speed = 0;
    this.mass = 0;
    this.power = 0;
    this.owner = null;
  }
}

module.exports = Spell;
