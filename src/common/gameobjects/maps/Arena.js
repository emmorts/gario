const GameObject = require('common/GameObject');
const Tileset = require('common/Tileset');

class Arena extends GameObject {
  constructor() {
    super();

    this.tileSize = null;
    this.cubicWidth = null;
    this.cubicHeight = null;
  
    this.tiledMap = null;
  }
}

module.exports = Arena;