const GameObject = require('common/GameObject');
const Tileset = require('common/Tileset');

class Arena extends GameObject {
  constructor() {
    super();

    this.tileSize = 8;
    this.width = 32;
    this.height = 32;

    this.tiledMap = this.buildMap();
  }

  buildMap() {
    const tiledMap = new Array(this.height);

    for (let row = 0; row < this.height; row++ ) {
      tiledMap[row] = new Array(this.width);
      
      for (let column = 0; column < this.width; column++) {
        tiledMap[row][column] = Tileset.FLAT;
      }
    }
    return tiledMap;
  }
}

module.exports = Arena;