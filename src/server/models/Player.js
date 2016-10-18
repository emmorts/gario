const uuid = require('node-uuid');
const PlayerBase = require('models/PlayerBase');

class Player extends PlayerBase {

  constructor(gameServer, owner) {
    super();

    this.id = uuid.v4().replace(/-/g, '');
    this.gameServer = gameServer;
    this.owner = owner;
    this.ownerId = owner.pId;
    this.position = null;
    this.color = null;
  }

}

module.exports = Player;