import { Tileset } from 'common/maps/Tileset';
import { IArenaType } from 'server/maps/arena/IArenaType';

export default class Donut implements IArenaType {

  build(width: number, height: number): Tileset[][] {
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
          map[row][column] = Tileset.Flat;
        } else {
          map[row][column] = Tileset.Lava;
        }
      }
    }

    return map;
  }

}