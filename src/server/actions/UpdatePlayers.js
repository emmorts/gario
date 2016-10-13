const Action = require('server/actions/Action');
const OPCode = require('opCode');

class UpdatePlayers extends Action {

  constructor() {
    super(OPCode.UPDATE_PLAYERS, ...arguments);
  }

  build(object) {
    if ('updatedPlayers' in object && 'destroyedPlayers' in object) {
      if (this.actionSchema) {
        const flattenedObject = {
          updatedPlayers: object.updatedPlayers.map(player => ({
            id: player.id,
            ownerId: player.ownerId,
            length: player.owner.name.length,
            name: player.owner.name,
            health: player.health,
            maxHealth: player.maxHealth,
            x: player.position.x,
            y: player.position.y,
            targetX: player.owner.target.x,
            targetY: player.owner.target.y,
            r: player.color.r,
            g: player.color.g,
            b: player.color.b
          })),
          destroyedPlayers: object.destroyedPlayers.map(player => ({
            id: player.id
          }))
        };

        return this.actionSchema.encode(flattenedObject);
      }
    } else {
      console.error(`Malformed object supplied in ${this.constructor.name}.build()`);
    }

    return null;
  }

}

module.exports = UpdatePlayers;