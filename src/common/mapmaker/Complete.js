const Tileset = require('common/Tileset');

module.exports = (width,height) => {
    const tiledMap = new Array(height);

    for (let row = 0; row < height; row++ ) {
      tiledMap[row] = new Array(width);
      
      for (let column = 0; column < width; column++) {
        tiledMap[row][column] = Tileset.FLAT;
      }
    }
    return tiledMap;
};