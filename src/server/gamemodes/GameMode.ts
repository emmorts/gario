import Map from 'common/Map';
import Player from 'server/models/Player';

export default abstract class GameMode {

  protected abstract _baseHealth: number;
  protected abstract _friction: number;
  protected abstract _map: Map = null;

  constructor(public name: string) {}

  get map() {
    return this._map;
  }

  onServerInit() {}
  onPlayerInit(player: Player) {}
  onPlayerSpawn(player: Player) {}
}
