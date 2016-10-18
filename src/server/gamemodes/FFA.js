const Mode = require('server/gamemodes/Mode');

class FFA extends Mode {
  constructor(gameServer) {
    super(gameServer);

    this.name = "Free For All";
    this.baseHealth = 100;
    this.friction = 0.1;
  }

  onPlayerSpawn(player) {
    player.color = this.getRandomColor();
    player.maxHealth = this.baseHealth;
    player.health = player.maxHealth;
  }

  _getRandomColor() {
    const rand = Math.floor(Math.random() * 3);
    if (rand === 0) {
      return {
        r: 255,
        b: Math.floor(Math.random() * 255),
        g: 0
      };
    } else if (rand === 1) {
      return {
        r: 0,
        b: 255,
        g: Math.floor(Math.random() * 255)
      };
    } else {
      return {
        r: Math.floor(Math.random() * 255),
        b: 0,
        g: 255
      };
    }
  };
}

module.exports = FFA;