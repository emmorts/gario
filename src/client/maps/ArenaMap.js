const TileRenderer = require('client/renderers/TileRenderer');
const Arena = require('common/gameobjects/maps/Arena');

class ArenaMap extends Arena {
  constructor() {
    super();
    this.renderer = TileRenderer;

    console.log(this.tiledMap);
    this.width = this.cubicWidth * this.tileSize;
    this.height = this.cubicHeight * this.tileSize;
  }

}

module.exports = ArenaMap;