import SmartMap from 'smartmap';
import WSController from './WSController';
import EventEmitter from './util/EventEmitter';
import * as Spells from './spells';
import * as Models from './models';

let instance = null;

export default class Game extends EventEmitter {
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
      instance = new Game();
      return instance;
    }
  }
  
  startGame(playerName, onConnection) {
    this.controller = new WSController();
    
    this.controller.on('open', function startGame() {
      
      this.controller.on('addPlayer', this._handleAddPlayer.bind(this));
      this.controller.on('updatePlayers', this._handleUpdatePlayers.bind(this));
      this.controller.on('updateSpells', this._handleUpdateSpells.bind(this));
      
      this.controller.spawn(playerName);
      
      this.onStart(onConnection);
    }.bind(this));
  }
  
  update(deltaT) {    
    this.playerList.forEach(player => player.calculateNextPosition(deltaT));
    this.spellList.forEach(spell => spell.calculateNextPosition(deltaT));
    
    this.spellList.forEach((spell, spellIndex) => {
      this.playerList.forEach(player => {
        if (spell.ownerId !== player.ownerId) {
          const distanceX = player.position.x - spell.position.x;
          const distanceY = player.position.y - spell.position.y;
          const distance = distanceX * distanceX + distanceY * distanceY;
          if (distance < Math.pow(spell.radius + player.radius, 2)) {
            spell.onCollision(player);
            this.spellList.splice(spellIndex, 1);
          }
        }
      });
    });
  }
  
  onStart(callback) {
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
      destroyedPlayers.forEach(destroyedPlayer => this.playerList.delete(destroyedPlayer), this);
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
      destroyedSpells.forEach(destroyedSpell => this.spellList.delete(destroyedSpell), this);
    }
  }
}