import GameMode from 'server/gamemodes/GameMode';
import ArenaMap from 'server/maps/ArenaMap';
import Logger from 'server/Logger';
import Player from 'server/models/Player';
import Map from 'common/Map';
import { ArenaType } from 'server/maps/arena/ArenaType';
import { GameModeType } from 'server/gamemodes/GameModeType';

export default class FFA extends GameMode {
  static type: GameModeType = GameModeType.FFA;

  protected _baseHealth = 100;
  protected _friction = 0.1;
  protected _map: Map = null;

  constructor() {
    super('Free For All');
  }

  onServerInit() {
    this._map = new ArenaMap()
      .setWidth(32)
      .setHeight(32)
      .setTileSize(64)
      .setType(ArenaType.Square)
      .build();

    Logger.info(`Map '${ArenaType[ArenaType.Square]}' has been initialized.`);
  }

  onPlayerSpawn(player: Player) {
    if (!player) {
      throw new Error(`Invalid player provided`);
    }

    if (!this._map) {
      throw new Error(`Map was not initialized`);
    }

    player.spawn({
      position: this._map.getSpawnPoint(),
      color: this.getRandomColor(),
      maxHealth: this._baseHealth,
      health: this._baseHealth
    });

    Logger.info(`Player '${player.name}' has been spawned on (${player.position.x}, ${player.position.y}).`);
  }

  private getRandomColor() {
    const rand = Math.floor(Math.random() * 3);

    if (rand === 0) {
      return {
        r: 150,
        b: Math.floor(Math.random() * 150),
        g: 0,
      };
    } else if (rand === 1) {
      return {
        r: 0,
        b: 150,
        g: Math.floor(Math.random() * 150),
      };
    }
    return {
      r: Math.floor(Math.random() * 150),
      b: 0,
      g: 150,
    };
  }
}
