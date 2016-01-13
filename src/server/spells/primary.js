const Spell = require('./spell');
const uuid = require('node-uuid');

function Primary(gameServer, owner) {
  Spell.apply(this, Array.prototype.slice.call(arguments));

  this.id = uuid.v4().replace(/-/g, '');
  this.owner = owner;
  this.ownerId = owner.pId;
  this.mass = 10;
  this.power = 10;
  this.gameServer = gameServer;
}

module.exports = Primary;

Primary.prototype = new Spell();

Primary.prototype.onAdd = function () {
  // override
}

Primary.prototype.onCollision = function (model) {
  // override
}