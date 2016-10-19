const uuid = require('node-uuid');
const WebSocket = require('ws');
const OPCode = require('opCode');
const Spells = require('server/spells');
const Action = require('server/actions');
const Factory = require ('server/Factory');

class PlayerController {
  constructor(gameServer, socket) {
    this.pId = -1;
    this.gameServer = gameServer;
    this.socket = socket;
    this.model = null;
    this.playerAdditionQueue = [];
    this.playerDestroyQueue = [];
    this.spellAdditionQueue = [];
    this.spellDestroyQueue = [];
    this.rechargingSpells = [];

    if (gameServer) {
      this.pId = uuid.v4().replace(/-/g, '');
    }
  }

  send(opCode, object) {
    if (opCode in Action) {
      console.log(`Sending '${OPCode.getName(opCode)}'`);

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
    if (this.model && target) {
      this.model.setTarget(target);

      this.gameServer.onTargetUpdated(this);
    }
  };

  spawn(name) {
    this.model = Factory.instantiate(
      OPCode.TYPE_MODEL,
      OPCode.MODEL_PLAYER,
      this.gameServer,
      this
    );

    this.model.name = name;

    this.gameServer.onPlayerSpawn(this);
  }

  cast(options) {
    if (!(options.type in this.rechargingSpells)) {
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
        this.rechargingSpells[options.type] = spell;

        setTimeout(() => delete this.rechargingSpells[options.type], spell.cooldown);

        this.gameServer.onCast(spell);
      }
    }
  };

  update() {
    this._updatePlayers();
    this._updateSpells();
  };

  _updatePlayers() {
    if (this.playerAdditionQueue.length || this.playerDestroyQueue.length) {
      this.send(OPCode.UPDATE_PLAYERS, {
        updatedPlayers: this.playerAdditionQueue,
        destroyedPlayers: this.playerDestroyQueue
      });
    }

    this.playerDestroyQueue = [];
    this.playerAdditionQueue = [];
  }

  _updateSpells() {
    if (this.spellAdditionQueue.length || this.spellDestroyQueue.length) {
      this.send(OPCode.UPDATE_SPELLS, {
        updatedSpells: this.spellAdditionQueue,
        destroyedSpells: this.spellDestroyQueue
      });
    }

    this.spellAdditionQueue = [];
    this.spellDestroyQueue = [];
  }

  _sendBuffer(buffer) {
    if (!buffer) {
      console.log('Empty buffer received, skipping message.');
    } else if (this.socket.readyState == WebSocket.OPEN) {
      this.socket.send(buffer, { binary: true }, error => {
        if (error) {
          console.log(`Failed to send a message('${error}').`);
        }
      });
    } else {
      console.log('Socket is not open, closing connection.');

      this.socket.readyState = WebSocket.CLOSED;
      this.socket.emit('close');
      this.socket.removeAllListeners();
    }
  }

}

module.exports = PlayerController;