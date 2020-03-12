import Action from 'server/actions/Action';
import { OperationCode } from 'common/OperationCode';
import { Socket } from 'server/Socket';
import Logger from 'server/Logger';

export default class InitializeMap extends Action {

  constructor(socket: Socket) {
    super(OperationCode.INITIALIZE_MAP, socket);
  }

  build(map: any) {
    if ('tiledMap' in map) {
      if (this.actionSchema) {
        const flattenedObject = {
          width: map.width,
          height: map.height,
          tileSize: map.tileSize,
          mapRows: map.tiledMap.map((row: any) => ({
            mapColumns: row.map((column: any) => ({
              value: column,
            })),
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
