const Tileset = require('common/Tileset');

module.exports = (width,height) => {
    //returns a with a hole of 25 percent (width and height must be and even number)
    const map = new Array(height);
    const holeVar = Math.sqrt(((Math.pow(width,2) * 25) / 100)) / 2; 

    for (let row = 0; row < height; row++ ) {
      map[row] = new Array(width);
      
      for (let column = 0; column < width; column++) {
        if((row >= holeVar && row < (height - holeVar)) && (column >= holeVar && column < (width - holeVar))) {
          map[row][column] = Tileset.LAVA;
        } else map[row][column] = Tileset.FLAT;
      }
    }
    return map;
};