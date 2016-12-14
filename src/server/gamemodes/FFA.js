const Mode = require('server/gamemodes/Mode');
const ArenaMap = require('server/maps/ArenaMap');
const Logger = require('server/Logger');
const Player = require('common/gameobjects/models/Player');

class FFA extends Mode {
  constructor(gameServer) {
    super(gameServer);

    this.name = 'Free For All';
    this.baseHealth = 100;
    this.friction = 0.1;
    this.map = null;
  }

  onServerInit() {
    this.map = new ArenaMap()
      .setWidth(32)
      .setHeight(32)
      .setTileSize(32)
      .setType('DONUT')
      .build();

    Logger.info(`Map '${this.map.constructor.name}' has been initialized.`);
  }

  onPlayerSpawn(player) {
    if (!player || !player.model || !(player.model instanceof Player)) {
      throw new Error(`Invalid player provided`);
    }

    if (!this.map) {
      throw new Error(`Map was not initialized`);
    }

    player.model.position = this.map.getSpawnPoint();
    player.model.color = FFA._getRandomColor();
    player.model.maxHealth = this.baseHealth;
    player.model.health = player.model.maxHealth;
    player.model.target = {
      x: player.model.position.x,
      y: player.model.position.y,
    };

    Logger.info(`Player '${player.model.name}' has been spawned on (${player.model.position.x}, ${player.model.position.y}).`);
  }

  static _getRandomColor() {
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

module.exports = FFA;
