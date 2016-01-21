const uuid = require('node-uuid');
const OPCode = require('../opCode');
const Packets = require('./packets');
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
  this.spells = [];
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

PlayerController.prototype.cast = function (type, options) {
  let spell = null;
  
  switch (type) {
    case OPCode.SPELL_PRIMARY:
      if (!(OPCode.SPELL_PRIMARY in this.spells)) {
        spell = new Spells.Primary(this.gameServer, this, { 
          position: {
            x: options.playerX,
            y: options.playerY
          },
          target: {
            x: options.x,
            y: options.y
          }
        });
        this.spells[OPCode.SPELL_PRIMARY] = spell;
        setTimeout(() => delete this.spells[OPCode.SPELL_PRIMARY], spell.cooldown);
      }
      break;
  }
  
  if (spell) {
    this.gameServer.onCast(spell);
  }
}

PlayerController.prototype.update = function () {
  if (this.nodeAdditionQueue.length > 0 || this.nodeDestroyQueue.length > 0) {
    this.socket.sendPacket(new Packets.UpdatePlayers(this.nodeDestroyQueue, this.nodeAdditionQueue));
  }
  
  this.nodeDestroyQueue = [];
  this.nodeAdditionQueue = [];
  
  if (this.spellAdditionQueue.length > 0 || this.spellDestroyQueue.length > 0) {
    this.socket.sendPacket(new Packets.UpdateSpells(this.spellDestroyQueue, this.spellAdditionQueue));
  }
  
  this.spellAdditionQueue = [];
  this.spellDestroyQueue = [];
}

module.exports = PlayerController;