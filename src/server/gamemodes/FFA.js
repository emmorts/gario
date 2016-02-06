const Mode = require('./Mode');

class FFA extends Mode {
  constructor(gameServer) {
    super(gameServer);
    
    this.name = "Free For All";
    this.baseHealth = 100;
    this.friction = 0.1;
  }
  
  onPlayerSpawn(player) {
    player.color = this.gameServer.getRandomColor();
    player.maxHealth = player.health = this.baseHealth;

    this.gameServer.spawnPlayer.call(this.gameServer, player);
  }
}

module.exports = FFA;