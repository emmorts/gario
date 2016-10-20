const uuid = require('node-uuid');
const OPCode = require('common/opCode');
const SpellBase = require('common/models/SpellBase');

class Primary extends SpellBase {
  constructor(gameServer, owner, options) {
    super();

    options = options || {};
    this.id = uuid.v4().replace(/-/g, '');
    this.type = OPCode.SPELL_PRIMARY;
    this.owner = owner;
    this.ownerId = owner.pId;
    this.gameServer = gameServer;
    this.position = options.position;
    this.mass = 10;
    this.power = 30;
    this.duration = 5000;
    this.cooldown = 1000;
    this.radius = 10;
    this.color = { r: 200, g: 150, b: 40 };

    this.setTarget(options.target);
  }
}

module.exports = Primary;