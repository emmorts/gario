const OPCode = require('../../opCode');
const uuid = require('node-uuid');

class Spell {
  constructor() {
    this.id = uuid.v4().replace(/-/g, '');
    this.type = OPCode.TYPE_SPELL;
    this.mass = 0;
    this.power = 0;
    this.duration = 0;
  }
  
  onAdd() {}
  onCollision(model) {}
}

module.exports = Spell;