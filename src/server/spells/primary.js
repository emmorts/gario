const Spell = require('./Spell');
const uuid = require('node-uuid');
const OPCode = require('../../opCode');

function Primary(gameServer, owner, options) {
  Spell.apply(this, Array.prototype.slice.call(arguments));

  options = options || {};
  
  this.id = uuid.v4().replace(/-/g, '');
  this.type = OPCode.SPELL_PRIMARY;
  this.owner = owner;
  this.ownerId = owner.pId;
  this.gameServer = gameServer;
  this.position = owner.model.position;
  this.target = options.target;
  this.mass = 10;
  this.power = 10;
  this.duration = 5000;
  this.color = {
    r: 200,
    g: 150,
    b: 40
  };
}

module.exports = Primary;

Primary.prototype = new Spell();

Primary.prototype.onAdd = function () {
  // override
}

Primary.prototype.onCollision = function (model) {
  // override
}