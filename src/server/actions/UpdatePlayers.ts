import Action from 'server/actions/Action';
import { OperationCode } from 'common/OperationCode';
import { Socket } from 'server/Socket';
import Logger from 'server/Logger';

export default class UpdatePlayers extends Action {

  constructor(socket: Socket) {
    super(OperationCode.UPDATE_PLAYERS, socket);
  }

  build(object: any) {
    if ('updatedPlayers' in object && 'destroyedPlayers' in object) {
      if (this.actionSchema) {
        const flattenedObject = {
          updatedPlayers: object.updatedPlayers.map((player: any) => ({
            id: player.id,
            ownerId: player.ownerId,
            length: player.name.length,
            name: player.name,
            health: player.health,
            maxHealth: player.maxHealth,
            x: player.position.x,
            y: player.position.y,
            targetX: player.target.x,
            targetY: player.target.y,
            r: player.color.r,
            g: player.color.g,
            b: player.color.b,
          })),
          destroyedPlayers: object.destroyedPlayers.map((player: any) => ({
            id: player.id,
          })),
        };

        return this.actionSchema.encode(flattenedObject);
      }
    } else {
      Logger.error(`Malformed object supplied in ${this.constructor.name}.build()`);
    }

    return null;
  }

}
