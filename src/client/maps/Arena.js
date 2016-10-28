const ArenaRenderer = require('client/renderers/ArenaRenderer');
const IArena = require('common/gameobjects/maps/IArena');

class Arena extends IArena {
  constructor(arena) {
    super();
    console.log(arena);
    this.renderer = ArenaRenderer;

    this.tileSize = arena.tileSize;
    this.widht = arena.widht;
    this.height = arena.height;
  
    this.map = arena.map;
  }

}

module.exports = Arena;