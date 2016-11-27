const Map = require('common/Map');
const Tileset = require('common/Tileset');
const Player = require('common/gameobjects/models/Player');

class Arena extends Map {
  constructor() {
    super();

    this.type = null;

    this.lavaDPS = 1;
    this.lavaTick = 1000;
    this.tiledMap = null;

    this._tickCooldown = {};
  }

  applyEffects(gameObject, deltaT) {
    if (gameObject instanceof Player) {
      const tileX = ~~(gameObject.position.x / this.tileSize);
      const tileY = ~~(gameObject.position.y / this.tileSize);

      const outsideMap = !this.withinBounds(gameObject.position.x, gameObject.position.y);
      const isOnLava = !outsideMap ? this.tiledMap[tileX][tileY] === Tileset.LAVA : false;

      if (outsideMap || isOnLava) {
        this._applyDamageOnPlayer(gameObject, deltaT);
      }
    }
  }

  _applyDamageOnPlayer(gameObject, deltaT) {
    if (!(gameObject.id in this._tickCooldown)) {
      this._tickCooldown[gameObject.id] = 0;
    }

    if (this._tickCooldown[gameObject.id] >= this.lavaTick) {
      gameObject.health -= this.lavaDPS * (this.lavaTick / 1000);

      this._tickCooldown[gameObject.id] -= this.lavaTick;
    } else {
      this._tickCooldown[gameObject.id] += deltaT;
    }
  }
}

module.exports = Arena;
