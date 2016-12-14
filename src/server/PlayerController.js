const uuid = require('node-uuid');
const OPCode = require('common/opCode');
const Factory = require('server/Factory');
const Logger = require('server/Logger');

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
    this.spellsOnCooldown = [];

    if (gameServer) {
      this.pId = uuid.v4().replace(/-/g, '');
    }
  }

  get packetHandler() {
    if (this.socket) {
      return this.socket.packetHandler;
    }

    Logger.info(`Player '${this.pId}' does not have an attached socket.`);

    return null;
  }

  setTarget(target) {
    if (this.model && target) {
      Logger.trace(`Player '${this.model.name}' moved to (${target.x}, ${target.y}).`);

      this.model.setTarget(target);

      this.gameServer.onTargetUpdated(this);
    }
  }

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
    if (!(options.type in this.spellsOnCooldown)) {
      const spell = Factory.instantiate(
        OPCode.TYPE_SPELL,
        options.type,
        this.gameServer,
        this,
        {
          position: {
            x: options.playerX,
            y: options.playerY,
          },
          target: {
            x: options.x,
            y: options.y,
          },
        }
      );

      if (spell) {
        this.spellsOnCooldown[options.type] = spell;

        setTimeout(() => delete this.spellsOnCooldown[options.type], spell.cooldown);

        this.gameServer.onCast(spell);
      }
    }
  }

  update() {
    this._updatePlayers();
    this._updateSpells();
  }

  _updatePlayers() {
    if (this.playerAdditionQueue.length || this.playerDestroyQueue.length) {
      this.packetHandler.send(OPCode.UPDATE_PLAYERS, {
        updatedPlayers: this.playerAdditionQueue,
        destroyedPlayers: this.playerDestroyQueue,
      });
    }

    this.playerDestroyQueue = [];
    this.playerAdditionQueue = [];
  }

  _updateSpells() {
    if (this.spellAdditionQueue.length || this.spellDestroyQueue.length) {
      this.packetHandler.send(OPCode.UPDATE_SPELLS, {
        updatedSpells: this.spellAdditionQueue,
        destroyedSpells: this.spellDestroyQueue,
      });
    }

    this.spellAdditionQueue = [];
    this.spellDestroyQueue = [];
  }
}

module.exports = PlayerController;
