const ArenaType = require('server/maps/arena/ArenaType');
const Arena = require('common/maps/Arena');
const Type = require('server/maps/arena/types');
const Tileset = require('common/Tileset');

class ArenaMap extends Arena {
  constructor(options) {
    super();

    this.type = Type[ArenaType.DEFAULT];

    this.tileSize = options ? options.tileSize : null;
    this.width = options ? options.width : null;
    this.height = options ? options.height : null;

    this.tiledMap = options ? options.map : null;
  }

  setType(type) {
    this.type = Type[ArenaType[type]];

    return this;
  }

  setTileSize(tileSize) {
    this.tileSize = tileSize;

    return this;
  }

  setWidth(width) {
    this.width = width;

    return this;
  }

  setHeight(height) {
    this.height = height;

    return this;
  }

  build() {
    if (!this.type) throw new Error('Unable to build map, type was not supplied.');
    if (!this.width) throw new Error('Unable to build map, width was not supplied.');
    if (!this.height) throw new Error('Unable to build map, height was not supplied.');
    if (!this.tileSize) throw new Error('Unable to build map, tile size was not supplied.');

    this.tiledMap = this.type.build(this.width, this.height);

    return this;
  }

  getSpawnPoint() {
    let randX = 0;
    let randY = 0;
    let isSafe = false;

    while (!isSafe) {
      randX = ~~(Math.random() * this.width);
      randY = ~~(Math.random() * this.height);

      if (this.tiledMap && this.tiledMap[randX][randY] !== Tileset.LAVA) {
        isSafe = true;
      }
    }

    return { x: randX * this.tileSize, y: randY * this.tileSize };
  }
}

module.exports = ArenaMap;
