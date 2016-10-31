class Mode {
  constructor(gameServer) {
    this.name = 'Blank Mode';
    this.friction = 0;
    this.gameServer = gameServer;
  }

  onServerInit() {
    this.gameServer.run = true;
  }

  onPlayerInit(player) {}
  onPlayerSpawn(player) {}
}

module.exports = Mode;
