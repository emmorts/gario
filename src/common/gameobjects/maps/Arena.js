const GameObject = require('common/GameObject');

class Arena extends GameObject {
  constructor() {
    super();

    this.type = null;

    this.tileSize = null;
    this.width = null;
    this.height = null;

    this.tiledMap = null;
  }
}

module.exports = Arena;
