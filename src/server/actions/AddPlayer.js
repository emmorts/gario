const Action = require('server/actions/Action');
const OPCode = require('common/opCode');

class AddPlayer extends Action {

  constructor() {
    super(OPCode.ADD_PLAYER, ...arguments);
  }

  build(object) {
    if (this.actionSchema) {
      const player = {
        id: object.id,
        ownerId: object.ownerId,
        length: object.name ? object.name.length : 0,
        name: object.name,
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