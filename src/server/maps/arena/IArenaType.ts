import { Tileset } from 'common/maps/Tileset';

export interface IArenaType {
  build(width: number, height: number): Tileset[][];
}