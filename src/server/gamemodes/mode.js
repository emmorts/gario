function Mode() {
  this.ID = -1;
  this.name = "Blank";
}

module.exports = Mode;

Mode.prototype.onServerInit = function (gameServer) {
  // Called when the server starts
  gameServer.run = true;
};

Mode.prototype.onTick = function (gameServer) {
  // Called on every game tick 
};

Mode.prototype.onChange = function (gameServer) {
  // Called when someone changes the gamemode via console commands
};

Mode.prototype.onPlayerInit = function (player) {
  // Called after a player object is constructed
};

Mode.prototype.onPlayerSpawn = function (gameServer, player) {
  // Called when a player is spawned
  player.color = gameServer.getRandomColor(); // Random color
  gameServer.spawnPlayer(player);
};

Mode.prototype.onCellMove = function (x1, y1, cell) {
  // Called when a player cell is moved
};