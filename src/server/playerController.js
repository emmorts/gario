const uuid = require('node-uuid');
const OPCode = require('../opCode');
const Packet = require('./packet');
const Spells = require('./spells');

function PlayerController(gameServer, socket) {
  this.pId = -1;
  this.gameServer = gameServer;
  this.socket = socket;
  this.name = "";
  this.model = null;
  this.nodeAdditionQueue = [];
  this.nodeDestroyQueue = [];
  this.spellAdditionQueue = [];
  this.spellDestroyQueue = [];
  
  this.target = {x: 0, y: 0};

  if (gameServer) {
    this.pId = uuid.v4().replace(/-/g, '');
  }
}

PlayerController.prototype.setName = function (value) {
  this.name = value;
}

PlayerController.prototype.setTarget = function (target) {
  this.target = target;
  
  this.gameServer.onTargetUpdated(this.socket);
}

PlayerController.prototype.cast = function (type, target) {
  let spell = null;
  
  switch (type) {
    case OPCode.SPELL_PRIMARY:
      spell = new Spells.Primary(this.gameServer, this, { target });
      break;
  }
  
  if (spell) {
    this.gameServer.onCast(spell);
  }
}

PlayerController.prototype.update = function () {
  if (this.nodeAdditionQueue.length > 0 || this.nodeDestroyQueue.length > 0) {
    this.socket.sendPacket(new Packet.UpdatePlayers(this.nodeDestroyQueue, this.nodeAdditionQueue));
  }
  
  this.nodeDestroyQueue = [];
  this.nodeAdditionQueue = [];
  
  if (this.spellAdditionQueue.length > 0 || this.spellDestroyQueue.length > 0) {
    this.socket.sendPacket(new Packet.UpdateSpells(this.spellDestroyQueue, this.spellAdditionQueue));
  }
  
  this.spellAdditionQueue = [];
  this.spellDestroyQueue = [];
}

module.exports = PlayerController;