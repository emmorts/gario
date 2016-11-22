const Action = require('server/actions/Action');
const OPCode = require('common/opCode');
const Logger = require('server/Logger');

class InitializeMap extends Action {

  constructor() {
    super(OPCode.INITIALIZE_MAP, ...arguments);
  }

  build(map) {
    if ('tiledMap' in map) {
      if (this.actionSchema) {
        const flattenedObject = {
          width: map.width,
          height: map.height,
          tileSize: map.tileSize,
          mapRows: map.tiledMap.map(row => ({
            mapColumns: row.map(column => ({
              value: column,
            })),
          })),
        };

        return this.actionSchema.encode(flattenedObject);
      }
    } else {
       Loggger.getInstance().error(`Malformed object supplied in ${this.constructor.name}.build()`);
    }

    return null;
  }

}

module.exports = InitializeMap;
