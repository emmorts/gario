const OPCode = require('../../opCode');

function Spell() {
  this.id = -1;
  this.ownerId = -1;
  this.type = OPCode.TYPE_SPELL;
  this.mass = 0;
  this.power = 0;
  this.duration = 0;
}

module.exports = Spell;

Spell.prototype.onAdd = function () {
  // override
}

Spell.prototype.onCollision = function (model) {
  model.health -= 10;
}