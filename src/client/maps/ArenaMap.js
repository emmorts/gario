const ArenaRenderer = require('client/renderers/ArenaRenderer');
const Arena = require('common/gameobjects/maps/Arena');

class ArenaMap extends Arena {
  constructor(arena) {
    super();

    this.renderer = ArenaRenderer;

    this.tileSize = arena.tileSize;
    this.widht = arena.widht;
    this.height = arena.height;

    this.map = arena.map;
  }

}

module.exports = ArenaMap;
