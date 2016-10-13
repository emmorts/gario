const Action = require('server/actions/Action');
const OPCode = require('opCode');

class AddPlayer extends Action {

  constructor() {
    super(OPCode.ADD_PLAYER, ...arguments);
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