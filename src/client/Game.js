const present = require('present');
const SmartMap = require('smartmap');
const OPCode = require('common/opCode');
const EventEmitter = require('common/EventEmitter');
const PacketHandler = require('client/PacketHandler');
const Factory = require('client/Factory');
const DebugRenderer = require('client/renderers/DebugRenderer');
const Logger = require('client/Logger');

let instance = null;

class Game {
  constructor() {
    if (instance) {
      throw new Error(`Game can't be initialized more than once.`);
    }

    EventEmitter.attach(this);

    this.currentPlayer = null;
    this.arena = null;
    this.playerList = new SmartMap('id', 'ownerId');
    this.spellList = new SmartMap('id');
    this.ping = 0;

    this._mapRenderer = null;
    this._gameObjectRenderer = null;
    this._gameLoopHandle = null;
    this._camera = null;
    this._lastUpdate = null;

    instance = this;
  }

  setMapRenderer(renderer) {
    if (renderer && this._mapRenderer !== renderer) {
      this._mapRenderer = renderer;
    }

    return this;
  }

  setGameObjectRenderer(renderer) {
    if (renderer && this._gameObjectRenderer !== renderer) {
      this._gameObjectRenderer = renderer;

      this._onGameObjectRendererChanged();
    }

    return this;
  }

  startGame(playerName, camera, onConnection) {
    this._camera = camera;

    this.packetHandler = new PacketHandler();

    this.packetHandler.on('open', () => {
      this.packetHandler.on('addPlayer', this._handleAddPlayer.bind(this));
      this.packetHandler.on('initializeMap', this._handleInitializeMap.bind(this));
      this.packetHandler.on('updatePlayers', this._handleUpdatePlayers.bind(this));
      this.packetHandler.on('updateSpells', this._handleUpdateSpells.bind(this));
      this.packetHandler.on('collision', this._handleCollision.bind(this));
      this.packetHandler.on('ping', this._handlePing.bind(this));

      this.packetHandler.send(OPCode.SPAWN_PLAYER, { name: playerName });

      this._onStart(onConnection);
      this._gameLoop(present());
    });

    return this;
  }

  update(deltaT) {
    this.playerList.forEach((player) => {
      player.packetQueue.forEach(packet => this.packetHandler.send(packet.code, packet.options));
      player.packetQueue.splice(0, player.packetQueue.length);

      player.update(deltaT);
    });

    this.spellList.forEach(spell => spell.update(deltaT));

    this._camera.update(deltaT);
    this._mapRenderer.draw(deltaT);
    this._gameObjectRenderer.draw(deltaT);
  }

  _gameLoop(timestamp) {
    const deltaT = timestamp - this._lastUpdate;

    this._gameLoopHandle = window.requestAnimationFrame(time => this._gameLoop(time));

    this.update(deltaT);

    // TODO: This doesn't belong here
    DebugRenderer.draw(this, this._gameObjectRenderer, deltaT);

    this._lastUpdate = timestamp;
  }

  _onGameObjectRendererChanged() {
    this.playerList.forEach(player => this._gameObjectRenderer.add(player));
    this.spellList.forEach(spell => this._gameObjectRenderer.add(spell));

    this.playerList.on('added', player => this._gameObjectRenderer.add(player));
    this.playerList.on('deleted', player => this._gameObjectRenderer.remove(player));
    this.spellList.on('added', spell => this._gameObjectRenderer.add(spell));
    this.spellList.on('deleted', spell => this._gameObjectRenderer.remove(spell));
  }

  _onStart(callback) {
    this._lastHeartbeat = Date.now();

    if (callback) {
      callback();
    }
  }

  _handleAddPlayer(player) {
    this.currentPlayer = Factory.instantiate(
      OPCode.TYPE_MODEL,
      OPCode.MODEL_PLAYER,
      player
    );

    this.playerList.add(this.currentPlayer);

    this.fire('playerSpawned', this.currentPlayer);
  }

  _handleInitializeMap(map) {
    const mapModel = Factory.instantiate(
      OPCode.TYPE_MAP,
      OPCode.MAP_ARENA,
      map
    );

    // HACK! Remove once separate map canvas is implemented
    this._mapRenderer.map = mapModel;
    // this._gameObjectRenderer._gameObjects.splice(0, 0, mapModel);
  }

  _handleUpdatePlayers(players) {
    const updatedPlayers = players.updatedPlayers;
    if (updatedPlayers && updatedPlayers.length > 0) {
      updatedPlayers.forEach((updatedPlayer) => {
        const foundPlayer = this.playerList.get(updatedPlayer.id, 'id');
        if (foundPlayer) {
          foundPlayer.setTarget(updatedPlayer.target);
        } else {
          const playerModel = Factory.instantiate(
            OPCode.TYPE_MODEL,
            OPCode.MODEL_PLAYER,
            updatedPlayer
          );

          this.playerList.add(playerModel);
        }
      }, this);
    }

    const destroyedPlayers = players.destroyedPlayers;
    if (destroyedPlayers && destroyedPlayers.length > 0) {
      destroyedPlayers.forEach(destroyedPlayer => this.playerList.delete(destroyedPlayer, 'id'), this);
    }
  }

  _handleUpdateSpells(spells) {
    const updatedSpells = spells.updatedSpells;
    if (updatedSpells && updatedSpells.length > 0) {
      updatedSpells.forEach((updatedSpell) => {
        const spellModel = Factory.instantiate(
          OPCode.TYPE_SPELL,
          OPCode.SPELL_PRIMARY,
          updatedSpell
        );

        spellModel.onAdd(this.playerList.get(spellModel.ownerId, 'ownerId'));

        this.spellList.add(spellModel);
      }, this);
    }

    const destroyedSpells = spells.destroyedSpells;
    if (destroyedSpells && destroyedSpells.length > 0) {
      destroyedSpells.forEach(destroyedSpell => this.spellList.delete(destroyedSpell, 'id'), this);
    }
  }

  _handleCollision(collision) {
    const actor = this.playerList.get(collision.actorId, 'id');
    const spell = this.spellList.get(collision.colliderId, 'id');

    if (actor && spell) {
      spell.onCollision(actor);

      this.spellList.delete(spell.id, 'id');
    } else {
      Logger.warn('Collision object malformed, unable to find actor or collider.');
    }
  }

  _handlePing(ping) {
    this.ping = Math.max(ping.timestamp - this._lastHeartbeat, 0);

    setTimeout(() => {
      this._lastHeartbeat = Date.now();

      this.packetHandler.send(OPCode.PONG);
    }, 1000);
  }
}

module.exports = new Game();
