import Arena from 'common/maps/Arena';
import Point from 'common/structures/Point';
import { Tileset } from 'common/maps/Tileset';
import Types from 'server/maps/arena';
import { ArenaType } from 'server/maps/arena/ArenaType';
import { IArenaType } from 'server/maps/arena/IArenaType';

export default class ArenaMap extends Arena {
  #type: IArenaType = new Types[ArenaType.Square]();

  setType(type: ArenaType) {
    this.#type = new Types[type]();

    return this;
  }

  setTileSize(tileSize: number) {
    this.tileSize = tileSize;

    return this;
  }

  setWidth(width: number) {
    this.width = width;

    return this;
  }

  setHeight(height: number) {
    this.height = height;

    return this;
  }

  build() {
    if (!this.#type) throw new Error('Unable to build map, type was not supplied.');
    if (!this.width) throw new Error('Unable to build map, width was not supplied.');
    if (!this.height) throw new Error('Unable to build map, height was not supplied.');
    if (!this.tileSize) throw new Error('Unable to build map, tile size was not supplied.');

    this.tiledMap = this.#type.build(this.width, this.height);

    return this;
  }

  getSpawnPoint(): Point {
    let randX = 0;
    let randY = 0;
    let isSafe = false;

    while (!isSafe) {
      randX = ~~(Math.random() * this.width);
      randY = ~~(Math.random() * this.height);

      if (this.tiledMap && this.tiledMap[randX][randY] !== Tileset.Lava) {
        isSafe = true;
      }
    }

    return new Point({
      x: randX * this.tileSize,
      y: randY * this.tileSize
    });
  }
}
