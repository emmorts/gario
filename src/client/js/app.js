var Graph = require('./graph');
var WSController = require('./wsController');
var KeyCode = require('./keyCode');
var Models = require('./models');

(function () {
  
  var graph;
  var ws;
  var animLoopHandle;
  var moveTick = performance.now();
  var targetTick = performance.now();
  var mouse = { x: 0, y: 0 };

  var playerList = [];
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
    
    playerList.forEach(function (player) {
      // var posX = player.position.x;
      // var posY = player.position.y;
      
      player.calculateNextPosition();
      
      // if (currentPlayer === player) {
      //   var now = performance.now();
      //   var diff = now - moveTick;
      //   if (diff > 100 && (player.position.x !== posX || player.position.y !== posY)) {
      //     ws.move(player);
      //     moveTick = now;
      //   }
      // }
      
    });
    
    graph
      .clear()
      .drawGrid()
      .drawBorder()
      .drawPlayers(playerList);
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
        mouse.x = event.x;
        mouse.y = event.y;
      });
      
      canvas.addEventListener('mousedown', function (event) {
        if (currentPlayer && event.button === 2) {
          event.preventDefault();
          event.stopPropagation();
          var now = performance.now();
          var diff = now - targetTick;
          if (diff > 100) {
            var targetX = currentPlayer.position.x + event.x - graph.screenWidth / 2;
            var targetY = currentPlayer.position.y + event.y - graph.screenHeight / 2;
            targetX = Math.min(Math.max(targetX, 0), graph._gameWidth);
            targetY = Math.min(Math.max(targetY, 0), graph._gameHeight);
            currentPlayer.setTarget(targetX, targetY);
            targetTick = now;
            ws.move(currentPlayer);
          }
        }
      });
      
      // canvas.addEventListener('keydown', function (event) {
      //   event.preventDefault();
      //   event.stopPropagation();
      //   switch (event.keyCode) {
      //     case KeyCode.Q:
      //       ws.cast(OPCode.CAST_PRIMARY, {
      //         x: mouse.x,
      //         y: mouse.y
      //       });
      //       break;
      //   }
      // });
      
      canvas.addEventListener('contextmenu', function (event) {
        event.preventDefault();
      });
      
      ws.spawn(playerName);
      
      ws.on('addNode', function (node) {
        currentPlayer = new Models.Player(node);
        graph.player = currentPlayer;
        playerList.push(currentPlayer);
      });
      
      ws.on('updateNodes', function (nodes) {
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
              if (playerList[i].id === destroyedNode.id) {
                index = i;
              }
            }
            playerList.splice(index, 1);
          });
        }
      });
      
    });
    
    if (!animLoopHandle) {
      animationLoop();
    }
  }
    
})();