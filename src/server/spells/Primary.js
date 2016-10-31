const uuid = require('node-uuid');
const OPCode = require('common/opCode');
const PrimaryBase = require('common/gameobjects/spells/Primary');

class Primary extends PrimaryBase {
  constructor(gameServer, owner, options) {
    super();

    if (options) {
      if (options.position) {
        this.position = options.position;
      }

      if (options.target) {
        this.setTarget(options.target);
      }
    }

    this.id = uuid.v4().replace(/-/g, '');
    this.type = OPCode.SPELL_PRIMARY;
    this.owner = owner;
    this.ownerId = owner.pId;
    this.gameServer = gameServer;
    this.mass = 10;
    this.power = 30;
    this.duration = 5000;
    this.cooldown = 1000;
    this.radius = 10;
    this.color = { r: 200, g: 150, b: 40 };
  }
}

module.exports = Primary;
