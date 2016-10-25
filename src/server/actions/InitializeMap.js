const Action = require('server/actions/Action');
const OPCode = require('common/opCode');

class InitializeMap extends Action {

  constructor() {
    super(OPCode.INITIALIZE_MAP, ...arguments);
  }

  build(arena) {
  if ('tiledMap' in arena) {
      if (this.actionSchema) {
        const flattenedObject = {
          width: arena.width,
          height: arena.height,
          tileSize: arena.tileSize,
          mapRows: arena.tiledMap.map(row => ({
            mapColumns: row.map(column => ({
              value: column
            }))
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

module.exports = InitializeMap;