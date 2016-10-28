const Action = require('server/actions/Action');
const OPCode = require('common/opCode');

class InitializeArena extends Action {

  constructor() {
    super(OPCode.INITIALIZE_ARENA, ...arguments);
  }

  build(arena) {
  if ('map' in arena) {
      if (this.actionSchema) {
        const flattenedObject = {
          width: arena.width,
          height: arena.height,
          tileSize: arena.tileSize,
          mapRows: arena.map.map(row => ({
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

module.exports = InitializeArena;