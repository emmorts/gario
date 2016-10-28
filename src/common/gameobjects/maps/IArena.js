const GameObject = require('common/GameObject');
const Tileset = require('common/Tileset');

class IArena extends GameObject {
  constructor() {
    super();

    this.tileSize = null;
    this.width = null;
    this.height = null;
    this.map = null;
    
  }
}

module.exports = IArena;