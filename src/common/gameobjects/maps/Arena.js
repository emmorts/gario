const GameObject = require('common/GameObject');
const Tileset = require('common/Tileset');

class Arena extends GameObject {
  constructor() {
    super();

    this.tileSize = 16;
    this.cubicWidth = 32;
    this.cubicHeight = 32;
  
    this.tiledMap = this.buildHolyMap();
  }

  buildMap() {
    const tiledMap = new Array(this.cubicHeight);

    for (let row = 0; row < this.cubicHeight; row++ ) {
      tiledMap[row] = new Array(this.cubicWidth);
      
      for (let column = 0; column < this.cubicWidth; column++) {
        tiledMap[row][column] = Tileset.FLAT;
      }
    }
    return tiledMap;
  }

    buildHolyMap() {
      //returns a map with a hole of 25 percent (width and height must be and even number)
      const tiledMap = new Array(this.cubicHeight);
      const holeVar = Math.sqrt(((Math.pow(this.cubicWidth,2) * 25) / 100)) / 2; 
      for (let row = 0; row < this.cubicHeight; row++ ) {
        tiledMap[row] = new Array(this.cubicWidth);
        for (let column = 0; column < this.cubicWidth; column++) {
          if((row >= holeVar && row < (this.cubicHeight - holeVar)) && (column >= holeVar && column < (this.cubicWidth - holeVar))) {
            tiledMap[row][column] = Tileset.LAVA;
          } else tiledMap[row][column] = Tileset.FLAT;
        }
      }
      return tiledMap;
    }

}

module.exports = Arena;