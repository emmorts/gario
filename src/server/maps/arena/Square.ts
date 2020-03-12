import { Tileset } from 'common/maps/Tileset';
import { IArenaType } from 'server/maps/arena/IArenaType';

export default class Square implements IArenaType {

  build(width: number, height: number): Tileset[][] {
    const map = new Array(height);

    for (let row = 0; row < height; row++) {
      map[row] = new Array(width);

      for (let column = 0; column < width; column++) {
        map[row][column] = Tileset.Flat;
      }
    }

    return map;
  }
  
}