class Mode {
  constructor(gameServer) {
    this.name = 'Blank Mode';
    this.friction = 0;
    this.gameServer = gameServer;
  }

  onServerInit() {
    this.gameServer.run = true;
  }

  onPlayerInit() {}
  onPlayerSpawn() {}
}

module.exports = Mode;
