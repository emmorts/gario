require('./polyfills');

var Graph = require('./graph');
var WSController = require('./wsController');
var KeyCode = require('./keyCode');
var Models = require('./models');
var Spells = require('./spells');
var OPCode = require('../../opCode');

(function () {
  
  var graph;
  var ws;
  var animLoopHandle;
  var moveTick = performance.now();
  var targetTick = performance.now();
  var mouse = { x: 0, y: 0 };

  var playerList = [];
  var spellList = [];
  var currentPlayer = null;

  var canvasElements = document.getElementsByClassName('js-canvas');
  if (canvasElements && canvasElements.length > 0) {
    var canvas = canvasElements[0];
    graph = new Graph(canvasElements[0]);
  }

  var playerNameElements = document.getElementsByClassName('js-player-name');
  var playButtonElements = document.getElementsByClassName('js-play-button');
  var errorElements = document.getElementsByClassName('js-error');
  if (playerNameElements && playerNameElements.length > 0 &&
      playButtonElements && playButtonElements.length > 0 &&
      errorElements && errorElements.length > 0) {
      var playerNameElement = playerNameElements[0];
      var playButtonElement = playButtonElements[0];
      var errorElement = errorElements[0];
      playerNameElement.addEventListener('keyup', function validate(event) {
        if (event && event.target) {
          var pattern = /^[a-zA-Z0-9 ]{0,25}$/;
          if (event.target.value.match(pattern)) {
            errorElement.style.display = 'none';
            playButtonElement.disabled = false;
          } else {
            errorElement.style.display = 'block';
            playButtonElement.disabled = true;
          }
        }
      });
      playButtonElement.addEventListener('mouseup', startGame);
  }

  function animationLoop() {
    animLoopHandle = window.requestAnimationFrame(animationLoop);
    
    gameLoop();
  }

  function gameLoop() {
    graph
      .clear()
      .drawGrid()
      // .drawBorder()
      .drawArena()
      .drawSpells(spellList)
      .drawPlayers(playerList)
      .drawDebug();
    
    playerList.forEach(player => player.calculateNextPosition());
    spellList.forEach(spell => spell.calculateNextPosition());
    

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
    var playerName = playerNameElement.value;
    var startMenuElements = document.getElementsByClassName('js-start-menu');
    if (startMenuElements && startMenuElements.length > 0) {
      startMenuElements[0].style.display = 'none';
    }
    
    ws = new WSController();

    ws.on('open', function startGame() {
      
      canvas.addEventListener('mousemove', function (event) {
        // mouse.x = -(graph.screenWidth / 2 - currentPlayer.position.x - event.x);
        // mouse.y = -(graph.screenHeight / 2 - currentPlayer.position.y - event.y);
        mouse.x = event.x;
        mouse.y = event.y;
        // console.log('screen', graph.screenWidth, graph.screenHeight);
        // console.log('player', currentPlayer.position.x, currentPlayer.position.y);
        // console.log('mouse', mouse.x, mouse.y);
        // console.log('estimate', 
        //   graph.screenWidth / 2 - currentPlayer.position.x - mouse.x,
        //   graph.screenHeight / 2 - currentPlayer.position.y - mouse.y);
      });
      
      canvas.addEventListener('mousedown', function (event) {
        if (currentPlayer && event.button === 2) {
          event.preventDefault();
          event.stopPropagation();
          var now = performance.now();
          var diff = now - targetTick;
          if (diff > 100) {
            var targetX = mouse.x;
            var targetY = mouse.y;
            targetX = Math.min(Math.max(targetX, 0), graph._gameWidth);
            targetY = Math.min(Math.max(targetY, 0), graph._gameHeight);
            currentPlayer.setTarget(targetX, targetY);
            targetTick = now;
            ws.move(currentPlayer);
          }
        }
      });
      
      canvas.addEventListener('keydown', function (event) {
        switch (event.keyCode) {
          case KeyCode.Q:
            ws.cast(OPCode.CAST_PRIMARY, {
              playerX: currentPlayer.position.x,
              playerY: currentPlayer.position.y,
              x: mouse.x,
              y: mouse.y
            });
            break;
        }
      });
      
      canvas.addEventListener('contextmenu', function (event) {
        event.preventDefault();
      });
      
      ws.spawn(playerName);
      
      ws.on('addPlayer', function (node) {
        currentPlayer = new Models.Player(node);
        graph.player = currentPlayer;
        playerList.push(currentPlayer);
      });
      
      ws.on('updatePlayers', function (nodes) {
        var updatedNodes = nodes.updatedNodes;
        if (updatedNodes && updatedNodes.length > 0) {
          updatedNodes.forEach(function (updatedNode) {
            var found = playerList.filter(player=> player.id === updatedNode.id);
            if (found.length === 0) {
              var player = new Models.Player(updatedNode);
              playerList.splice(0, 0, player);
            } else {
              found[0].setTarget(updatedNode.targetX, updatedNode.targetY);
            }
          });
        }
        
        var destroyedNodes = nodes.destroyedNodes;
        if (destroyedNodes && destroyedNodes.length > 0) {
          destroyedNodes.forEach(function (destroyedNode) {
            var index = -1;
            for (var i = 0; i < playerList.length; i++) {
              if (playerList[i].id === destroyedNode) {
                index = i;
              }
            }
            if (index !== -1) {
              playerList.splice(index, 1);
            }
          });
        }
      });
      
      ws.on('updateSpells', function (spells) {
        var updatedSpells = spells.updatedSpells;
        if (updatedSpells && updatedSpells.length > 0) {
          updatedSpells.forEach(function (updatedSpell) {
            var SpellClass = Spells.get(updatedSpell.type);
            var spell = new SpellClass(updatedSpell);
            spellList.splice(0, 0, spell);
          });
        }
        
        var destroyedSpells = spells.destroyedSpells;
        if (destroyedSpells && destroyedSpells.length > 0) {
          destroyedSpells.forEach(function (destroyedSpell) {
            var index = -1;
            for (var i = 0; i < spellList.length; i++) {
              if (spellList[i].id === destroyedSpell) {
                index = i;
              }
            }
            if (index !== -1) {
              spellList.splice(index, 1);
            }
          });
        }
      });
      
    });
    
    if (!animLoopHandle) {
      animationLoop();
    }
  }
    
})();