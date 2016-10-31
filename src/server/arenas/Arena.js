const Arena = require('common/gameobjects/maps/Arena');

class Arena extends Arena {
  constructor(params) {
    super();

    this.tileSize = params.tileSize;
    this.width = params.width;
    this.height = params.height;
  
    this.map = params.map;

  }
}

module.exports = Arena;