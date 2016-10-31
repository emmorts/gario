const Tileset = require('common/Tileset');

class Default {
  static build(width, height) {
    const map = new Array(height);

    for (let row = 0; row < height; row++) {
      map[row] = new Array(width);

      for (let column = 0; column < width; column++) {
        map[row][column] = Tileset.FLAT;
      }
    }

    return map;
  }
}

module.exports = Default;
