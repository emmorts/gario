const uuid = require('node-uuid');
const OPCode = require('../opCode');
const Packets = require('./packets');
const Spells = require('./spells');
const Factory = require ('./Factory');

class PlayerController {

  constructor(gameServer, socket) {
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

  setTarget(target) {
    this.target = target;
    
    this.gameServer.onTargetUpdated(this.socket);
  };
  
  spawn(name) {
    this._setName(name);
    
    this.gameServer.spawnPlayer(this);
  }

  cast(spellType, options) {
    if (!(spellType in this.spells)) {
      const spell = Factory.instantiate(
        OPCode.TYPE_SPELL, 
        spellType, 
        this.gameServer, 
        this, 
          {
          position: {
            x: options.playerX,
            y: options.playerY
          },
          target: {
            x: options.x,
            y: options.y
          }
        }
      );

      if (spell) {
        this.spells[spellType] = spell;

        setTimeout(() => delete this.spells[spellType], spell.cooldown);

        this.gameServer.onCast(spell);
      }
    }
  };

  update() {
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
  };

  _setName(value) {
    this.name = value;
  };
  
}

module.exports = PlayerController;