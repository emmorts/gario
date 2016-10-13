const OPCode = require('../../opCode');
const Spell = require('spells/Spell');

class Primary extends Spell {
  constructor(gameServer, owner, options) {
    super();
    
    options = options || {};
    this.type = OPCode.SPELL_PRIMARY;
    this.owner = owner;
    this.gameServer = gameServer;
    this.position = options.position;
    this.target = options.target;
    this.mass = 10;
    this.power = 30;
    this.duration = 5000;
    this.cooldown = 1000;
    this.radius = 10;
    this.color = { r: 200, g: 150, b: 40 };
  }
  
  onCollision(model) {
    model.health -= 10;
  }
}

module.exports = Primary;