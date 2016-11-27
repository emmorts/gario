const ArenaRenderer = require('client/renderers/ArenaRenderer');
const Arena = require('common/maps/Arena');

class ArenaMap extends Arena {
  constructor(arena) {
    super();

    this.renderer = ArenaRenderer;

    this.tileSize = arena.tileSize;
    this.width = arena.width;
    this.height = arena.height;

    this.tiledMap = arena.tiledMap;
  }

}

module.exports = ArenaMap;
