import GameObject from 'common/GameObject';
import Point from 'common/structures/Point';
import { Tileset } from 'common/maps/Tileset';

interface MapConstructorParameters {
  width: number,
  height: number,
  tileSize: number,
  tiledMap: Tileset[][]
}

export default abstract class Map {
  protected width: number;
  protected height: number;
  protected tileSize: number;
  protected tiledMap: number[][];

  constructor(options?: MapConstructorParameters) {
    if (options) {
      this.width = options.width;
      this.height = options.height;
      this.tileSize = options.tileSize;
      this.tiledMap = options.tiledMap;
    }
  }

  withinBounds(x: number, y: number) {
    const insideHorizontally = x >= 0 && x <= this.width * this.tileSize;
    const insideVerically = y >= 0 && y <= this.height * this.tileSize;

    return insideHorizontally && insideVerically;
  }

  abstract applyEffects(gameObject: GameObject, deltaT: number): void;
  abstract getSpawnPoint(): Point;
}
