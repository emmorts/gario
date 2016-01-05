const Mode = require('./Mode');

function FFA() {
  Mode.apply(this, Array.prototype.slice.call(arguments));

  this.ID = 0;
  this.name = "Free For All";
}

module.exports = FFA;

FFA.prototype = new Mode();

FFA.prototype.onPlayerSpawn = function (gameServer, player) {
  player.color = gameServer.getRandomColor();

  gameServer.spawnPlayer(player);
}