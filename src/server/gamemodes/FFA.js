const config = require('server/config');
const Mode = require('server/gamemodes/Mode');

class FFA extends Mode {
  constructor(gameServer) {
    super(gameServer);

    this.name = "Free For All";
    this.baseHealth = 100;
    this.friction = 0.1;
  }

  onPlayerSpawn(player) {
    if (player && player.model) {
      player.model.position = this._getRandomPosition();
      player.model.color = this._getRandomColor();
      player.model.maxHealth = this.baseHealth;
      player.model.health = player.model.maxHealth;
      player.model.target = {
        x: player.model.position.x,
        y: player.model.position.y
      };
    }
  }

  _getRandomPosition() {
    return {
      x: Math.floor(Math.random() * config.gameWidth),
      y: Math.floor(Math.random() * config.gameHeight)
    };
  }

  _getRandomColor() {
    const rand = Math.floor(Math.random() * 3);
    if (rand === 0) {
      return {
        r: 150,
        b: Math.floor(Math.random() * 150),
        g: 0
      };
    } else if (rand === 1) {
      return {
        r: 0,
        b: 150,
        g: Math.floor(Math.random() * 150)
      };
    } else {
      return {
        r: Math.floor(Math.random() * 150),
        b: 0,
        g: 150
      };
    }
  };
}

module.exports = FFA;