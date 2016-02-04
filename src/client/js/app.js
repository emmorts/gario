require('./polyfills');

var Models = require('./models');
var OPCode = require('../../opCode');

import SmartMap from 'smartmap';
import KeyCode from './KeyCode';
import Graph from './Graph';
import WSController from './WSController';
import DomElement from './DomElement';
import * as Spells from './spells';

(function () {
  
  var graph;
  var ws;
  var animLoopHandle;
  var lastUpdate;
  var moveTick = performance.now();
  var targetTick = performance.now();
  var mouse = { x: 0, y: 0 };
  var scrollDirection = null;

  var playerList = new SmartMap('id', 'ownerId');
  var spellList = new SmartMap('id');
  var currentPlayer = null;

  var canvas = new DomElement('.js-canvas', Graph);
  graph = canvas.instance;

  var playerNameElement = new DomElement('.js-player-name');
  var playButtonElement = new DomElement('.js-play-button');
  var errorElement = new DomElement('.js-error');
  
  playButtonElement.on('mouseup', startGame);
  playerNameElement.on('keyup', function validate(event) {
    if (!~[KeyCode.ENTER, KeyCode.MAC_ENTER].indexOf(event.keyCode)) {
      startGame();
    } else {
      var pattern = /^[a-zA-Z0-9 ]{0,25}$/;
      if (event.target.value.match(pattern)) {
        errorElement.htmlElement.style.display = 'none';
        playButtonElement.htmlElement.disabled = false;
      } else {
        errorElement.htmlElement.style.display = 'block';
        playButtonElement.htmlElement.disabled = true;
      }
    }
  });

  function animationLoop(timestamp) {
    animLoopHandle = window.requestAnimationFrame(animationLoop);
    
    gameLoop(timestamp - lastUpdate);
    lastUpdate = timestamp;
  }

  function gameLoop(deltaT) {
    graph
      .clear()
      .updateOffset(scrollDirection)
      .drawGrid()
      .drawArena()
      .drawSpells(spellList)
      .drawPlayers(playerList)
      .drawDebug();
    
    playerList.forEach(player => player.calculateNextPosition(deltaT));
    spellList.forEach(spell => spell.calculateNextPosition(deltaT));
    
    spellList.forEach((spell, spellIndex) => {
      playerList.forEach(player => {
        if (spell.ownerId !== player.ownerId) {
          var distanceX = player.position.x - spell.position.x;
          var distanceY = player.position.y - spell.position.y;
          var distance = distanceX * distanceX + distanceY * distanceY;
          if (distance < Math.pow(spell.radius + player.radius, 2)) {
            spell.onCollision(player);
            spellList.splice(spellIndex, 1);
          }
        }
      });
    });
  }

  function startGame () {
    var playerName = playerNameElement.htmlElement.value;
    new DomElement('.js-start-menu').htmlElement.style.display = 'none';
    
    ws = new WSController();

    ws.on('open', function startGame() {
      
      ws.spawn(playerName);
      
      canvas.on('contextmenu', event => event.preventDefault());
      
      canvas.on('mousemove', function (event) {
        var westBreakpoint = graph.screenWidth / 10,
            eastBreakpoint = graph.screenWidth * 9 / 10,
            northBreakpoint = graph.screenHeight / 10,
            southBreakpoint = graph.screenHeight * 9 / 10;
            
        if (event.x < westBreakpoint && event.y < northBreakpoint) {
          scrollDirection = OPCode.DIRECTION_NWEST;
        } else if (event.x > eastBreakpoint && event.y < northBreakpoint) {
          scrollDirection = OPCode.DIRECTION_NEAST;
        } else if (event.x < westBreakpoint && event.y > southBreakpoint) {
          scrollDirection = OPCode.DIRECTION_SWEST;
        } else if (event.x > eastBreakpoint && event.y > southBreakpoint) {
          scrollDirection = OPCode.DIRECTION_SEAST;
        } else if (event.x < westBreakpoint) {
          scrollDirection = OPCode.DIRECTION_WEST;
        } else if (event.x > eastBreakpoint) {
          scrollDirection = OPCode.DIRECTION_EAST;
        } else if (event.y < northBreakpoint) {
          scrollDirection = OPCode.DIRECTION_NORTH;
        } else if (event.y > southBreakpoint) {
          scrollDirection = OPCode.DIRECTION_SOUTH;
        } else {
          scrollDirection = null;
        }
        mouse.x = event.x;
        mouse.y = event.y;
      });
      
      canvas.on('mousedown', function (event) {
        if (currentPlayer && event.button === 2) {
          event.preventDefault();
          event.stopPropagation();
          var now = performance.now();
          var diff = now - targetTick;
          if (diff > 100) {
            var targetX = mouse.x + graph.xOffset;
            var targetY = mouse.y + graph.yOffset;
            targetX = Math.min(Math.max(targetX, 0), graph._gameWidth);
            targetY = Math.min(Math.max(targetY, 0), graph._gameHeight);
            currentPlayer.setTarget({ x: targetX, y: targetY});
            targetTick = now;
            ws.move(currentPlayer);
          }
        }
      });
      
      window.document.addEventListener('keydown', function (event) {
        switch (event.keyCode) {
          case KeyCode.Q:
            ws.cast(OPCode.CAST_PRIMARY, {
              playerX: currentPlayer.position.x,
              playerY: currentPlayer.position.y,
              x: mouse.x + graph.xOffset,
              y: mouse.y + graph.yOffset
            });
            break;
        }
      });
      
      
      ws.on('addPlayer', function (node) {
        currentPlayer = new Models.Player(node);
        graph.player = currentPlayer;
        playerList.add(currentPlayer);
      });
      
      ws.on('updatePlayers', function (players) {
        var updatedPlayers = players.updatedPlayers;
        if (updatedPlayers && updatedPlayers.length > 0) {
          updatedPlayers.forEach(updatedPlayer => {
            var foundPlayer = playerList.get(updatedPlayer.id, 'id');
            if (foundPlayer) {
              foundPlayer.setTarget(updatedPlayer.target);
            } else {
              var player = new Models.Player(updatedPlayer);
              playerList.add(player);
            }
          });
        }
        
        var destroyedPlayers = players.destroyedPlayers;
        if (destroyedPlayers && destroyedPlayers.length > 0) {
          destroyedPlayers.forEach(destroyedPlayer => playerList.delete(destroyedPlayer));
        }
      });
      
      ws.on('updateSpells', function (spells) {
        var updatedSpells = spells.updatedSpells;
        if (updatedSpells && updatedSpells.length > 0) {
          updatedSpells.forEach(function (updatedSpell) {
            var SpellClass = Spells.get(updatedSpell.type);
            var spell = new SpellClass(updatedSpell);
            spell.onAdd(playerList.get(spell.ownerId, 'ownerId'));
            spellList.add(spell);
          });
        }
        
        var destroyedSpells = spells.destroyedSpells;
        if (destroyedSpells && destroyedSpells.length > 0) {
          destroyedSpells.forEach(destroyedSpell => spellList.delete(destroyedSpell));
        }
      });
      
    });
    
    if (!animLoopHandle) {
      lastUpdate = Date.now();
      animationLoop(lastUpdate);
    }
  }
    
})();