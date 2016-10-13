const Action = require('actions/Action');
const OPCode = require('../../opCode');

let instance = null;

class AddPlayer extends Action {

  constructor() {
    if (instance) return instance;

    super(OPCode.ADD_PLAYER, ...arguments);

    instance = this;
  }

  build(object) {
    if (this.actionSchema) {
      const player = {
        id: object.id,
        ownerId: object.ownerId,
        length: object.owner.name.length,
        name: object.owner.name,
        health: object.health,
        maxHealth: object.maxHealth,
        x: object.position.x,
        y: object.position.y,
        r: object.color.r,
        g: object.color.g,
        b: object.color.b
      };

      return this.actionSchema.encode(player);
    }

    return null;
  }
  
}

module.exports = AddPlayer;