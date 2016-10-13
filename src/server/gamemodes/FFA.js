const Mode = require('server/gamemodes/Mode');

class FFA extends Mode {
  constructor(gameServer) {
    super(gameServer);

    this.name = "Free For All";
    this.baseHealth = 100;
    this.friction = 0.1;
  }

  onPlayerSpawn(player) {
    player.color = this.gameServer.getRandomColor();
    player.maxHealth = this.baseHealth;
    player.health = player.maxHealth;
  }
}

module.exports = FFA;