const ArenaRenderer = require('client/renderers/ArenaRenderer');
const Arena = require('common/gameobjects/maps/Arena');

class ArenaMap extends Arena {
  constructor(arena) {
    super();
    console.log(arena);
    this.renderer = ArenaRenderer;

    this.tileSize = arena.tileSize;
    this.cubicWidth = arena.cubicWidth;
    this.cubicHeight = arena.cubicHeight;
  
    this.tiledMap = arena.tiledMap;
  }

}

module.exports = ArenaMap;