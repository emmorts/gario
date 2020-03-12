import { ArenaType } from 'server/maps/arena/ArenaType';
import Square from 'server/maps/arena/Square';
import Donut from 'server/maps/arena/Donut';

export default {
  [ArenaType.Square]: Square,
  [ArenaType.Donut]: Donut
};