const SmartMap = require('smartmap');
const OPCode = require('opCode');
const EventEmitter = require('EventEmitter');
const WSController = require('client/WSController');

import * as Spells from 'client/spells';
import * as Models from 'client/models';

let instance = null;

class Game extends EventEmitter {
  constructor() {
    super();

    this.started = false;
    this.currentPlayer = null;
    this.controller = null;
    this.playerList = new SmartMap('id', 'ownerId');
    this.spellList = new SmartMap('id');
  }

  static getInstance() {
    if (instance) {
      return instance;
    } else {
      return instance = new Game();
    }
  }

  startGame(playerName, onConnection) {
    this.controller = new WSController();

    this.controller.on('open', function startGame() {

      this.controller.on('addPlayer', this._handleAddPlayer.bind(this));
      this.controller.on('updatePlayers', this._handleUpdatePlayers.bind(this));
      this.controller.on('updateSpells', this._handleUpdateSpells.bind(this));

      this.controller.send(OPCode.SPAWN_PLAYER, { name: playerName });

      this._onStart(onConnection);
    }.bind(this));

    return this;
  }

  update(deltaT) {
    this.playerList.forEach(player => player.update(deltaT));
    this.spellList.forEach(spell => spell.update(deltaT));

    this._detectCollisions();
  }

  _detectCollisions() {
    this.spellList.forEach(spell => {
      this.playerList.forEach(player => {
        if (spell.ownerId !== player.ownerId && this._didCollide(player, spell)) {
          spell.onCollision(player);

          this.spellList.delete(spell.id, 'id');
        }
      });
    });
  }

  _didCollide(actor, collider) {
    const distanceX = actor.position.x - collider.position.x;
    const distanceY = actor.position.y - collider.position.y;
    const distance = distanceX * distanceX + distanceY * distanceY;

    return distance <= Math.pow(collider.radius + actor.radius, 2);
  }

  _onStart(callback) {
    this.started = true;

    if (callback) {
      callback();
    }
  }

  _handleAddPlayer (player) {
    this.currentPlayer = new Models.Player(player);
    this._fire('addPlayer');
    this.playerList.add(this.currentPlayer);
  }

  _handleUpdatePlayers (players) {
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

  _handleUpdateSpells (spells) {
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
}

module.exports = Game;