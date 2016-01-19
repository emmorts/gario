const Mode = require('./Mode');

function FFA() {
  Mode.apply(this, Array.prototype.slice.call(arguments));

  this.id = 0;
  this.name = "Free For All";
  this.baseHealth = 100;
  this.friction = 0.1;
}

module.exports = FFA;

FFA.prototype = new Mode();

FFA.prototype.onPlayerSpawn = function (gameServer, player) {
  player.color = gameServer.getRandomColor();

  gameServer.spawnPlayer.call(gameServer, player);
}