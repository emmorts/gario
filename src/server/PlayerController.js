const uuid = require('node-uuid');
const WebSocket = require('ws');
const OPCode = require('opCode');
const Packets = require('server/packets');
const Spells = require('server/spells');
const Action = require('server/actions');
const Factory = require ('server/Factory');

class PlayerController {

  constructor(gameServer, socket) {
    this.pId = -1;
    this.gameServer = gameServer;
    this.socket = socket;
    this.name = "";
    this.model = null;
    this.playerAdditionQueue = [];
    this.playerDestroyQueue = [];
    this.spellAdditionQueue = [];
    this.spellDestroyQueue = [];
    this.spells = [];
    this.target = {x: 0, y: 0};

    if (gameServer) {
      this.pId = uuid.v4().replace(/-/g, '');
    }
  }

  send(opCode, object) {
    if (opCode in Action) {
      const action = new Action[opCode]();
      const buffer = action.build(object);

      if (buffer) {
        this._sendBuffer(buffer);
      }
    } else {
      console.error(`Operation '${OPCode.getName(opCode)}' does not cover any action.'`);
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

  cast(options) {
    if (!(options.type in this.spells)) {
      const spell = Factory.instantiate(
        OPCode.TYPE_SPELL,
        options.type,
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
        this.spells[options.type] = spell;

        setTimeout(() => delete this.spells[options.type], spell.cooldown);

        this.gameServer.onCast(spell);
      }
    }
  };

  update() {
    this._updatePlayers();
    this._updateSpells();
  };

  _updatePlayers() {
    if (this.playerAdditionQueue.length > 0 || this.playerDestroyQueue.length > 0) {
      this.send(OPCode.UPDATE_PLAYERS, {
        updatedPlayers: this.playerAdditionQueue,
        destroyedPlayers: this.playerDestroyQueue
      });
    }

    this.playerDestroyQueue = [];
    this.playerAdditionQueue = [];
  }

  _updateSpells() {
    if (this.spellAdditionQueue.length > 0 || this.spellDestroyQueue.length > 0) {
      this.send(OPCode.UPDATE_SPELLS, {
        updatedSpells: this.spellAdditionQueue,
        destroyedSpells: this.spellDestroyQueue
      });
    }

    this.spellAdditionQueue = [];
    this.spellDestroyQueue = [];
  }

  _setName(value) {
    this.name = value;
  };

  _sendBuffer(buffer) {
    if (this.socket.readyState == WebSocket.OPEN && buffer) {
      this.socket.send(buffer, { binary: true });
    } else {
      this.socket.readyState = WebSocket.CLOSED;
      this.socket.emit('close');
      this.socket.removeAllListeners();
    }
  }

}

module.exports = PlayerController;