const present = require('present');
const SmartMap = require('smartmap');
const OPCode = require('common/opCode');
const EventEmitter = require('common/EventEmitter');
const PacketHandler = require('client/PacketHandler');

import * as Spells from 'client/spells';
import * as Models from 'client/models';

let instance = null;

class Game {
  constructor() {
    EventEmitter.attach(this);

    this.currentPlayer = null;
    this.controller = null;
    this.playerList = new SmartMap('id', 'ownerId');
    this.spellList = new SmartMap('id');
    this.ping = 0;
  }

  static getInstance() {
    if (instance) {
      return instance;
    } else {
      return instance = new Game();
    }
  }

  startGame(playerName, onConnection) {
    this.packetHandler = new PacketHandler();

    this.packetHandler.on('open', function startGame() {
      
      this.packetHandler.on('addPlayer', this._handleAddPlayer.bind(this));
      this.packetHandler.on('updatePlayers', this._handleUpdatePlayers.bind(this));
      this.packetHandler.on('updateSpells', this._handleUpdateSpells.bind(this));
      this.packetHandler.on('collision', this._handleCollision.bind(this));
      this.packetHandler.on('ping', this._handlePing.bind(this));

      this.packetHandler.send(OPCode.SPAWN_PLAYER, { name: playerName });

      this._onStart(onConnection);
    }.bind(this));

    return this;
  }

  update(deltaT) {
    this.playerList.forEach(player => player.update(deltaT));
    this.spellList.forEach(spell => spell.update(deltaT));
  }

  _onStart(callback) {
    this._lastHeartbeat = Date.now();

    if (callback) {
      callback();
    }
  }

  _handleAddPlayer(player) {
    this.currentPlayer = new Models.Player(player);
    this.playerList.add(this.currentPlayer);
    this.fire('addPlayer');
  }

  _handleUpdatePlayers(players) {
    const updatedPlayers = players.updatedPlayers;
    if (updatedPlayers && updatedPlayers.length > 0) {
      updatedPlayers.forEach(updatedPlayer => {
        const foundPlayer = this.playerList.get(updatedPlayer.id, 'id');
        if (foundPlayer) {
          foundPlayer.setTarget(updatedPlayer.target);
        } else {
          const player = new Models.Player(updatedPlayer);
          this.playerList.add(player);
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
      updatedSpells.forEach(updatedSpell => {
        const SpellClass = Spells.get(updatedSpell.type);
        const spell = new SpellClass(updatedSpell);
        spell.onAdd(this.playerList.get(spell.ownerId, 'ownerId'));
        this.spellList.add(spell);
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
      console.warn(`Collision object malformed, unable to find actor or collider.`);
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

module.exports = Game;