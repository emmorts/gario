const Tileset = require('common/Tileset');

class Donut {
  static build(width, height) {
    const holeSize = 0.25;
    const holeWidth = (width * holeSize) | 0;
    const holeHeight = (height * holeSize) | 0;
    const holeRowOffset = (width - holeWidth) / 2;
    const holeColOffset = (height - holeHeight) / 2;

    const map = new Array(height);

    for (let row = 0; row < height; row++) {
      map[row] = new Array(width);

      for (let column = 0; column < width; column++) {
        if (row < holeRowOffset
         || row > holeWidth + holeRowOffset
         || column < holeColOffset
         || column > holeHeight + holeColOffset) {
          map[row][column] = Tileset.FLAT;
        } else {
          map[row][column] = Tileset.LAVA;
        }
      }
    }
    return map;
  }
}

module.exports = Donut;
