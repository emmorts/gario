/* global Graph */
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
    // if (player) {
    //   var posX = player.position.x;
    //   var posY = player.position.y;
      
    //   player.calculateNextPosition();
      
    //   var now = performance.now();
    //   var diff = now - moveTick;
    //   if (diff > 1000 && (player.position.x !== posX || player.position.y !== posY)) {
    //     ws.move(player);
    //     moveTick = now;
    //   }
    // }
    
    playerList.forEach(function (player) {
      var posX = player.position.x;
      var posY = player.position.y;
      
      player.calculateNextPosition();
      
      if (currentPlayer === player) {
        var now = performance.now();
        var diff = now - moveTick;
        if (diff > 100 && (player.position.x !== posX || player.position.y !== posY)) {
          ws.move(player);
          moveTick = now;
        }
      }
      
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
      
      canvas.addEventListener('mousedown', function (event) {
        if (currentPlayer && event.button === 2 && (mouse.x !== event.x || mouse.y !== event.y)) {
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
            mouse.x = event.x;
            mouse.y = event.y;
            // ws.mouseMove({
            //   x: Math.min(targetX, graph._gameWidth),
            //   y: Math.min(targetY, graph._gameHeight)
            // });
          }
        }
      });
      
      canvas.addEventListener('contextmenu', function (event) {
        event.preventDefault();
      });
      
      ws.spawn(playerName);
      
      ws.on('addNode', function (node) {
        currentPlayer = new Player(node);
        graph.player = currentPlayer;
        playerList.push(currentPlayer);
      });
      
      ws.on('updateNodes', function (updatedNodes) {
        updatedNodes.forEach(function (updatedNode) {
          var found = playerList.filter(function (player) {
            return player.id === updatedNode.id;
          });
          if (found.length === 0) {
            var player = new Player(updatedNode);
            playerList.splice(0, 0, player);
          } else {
            // found[0].position.x = updatedNode.x;
            // found[0].position.y = updatedNode.y;
            found[0].target.x = updatedNode.targetX;
            found[0].target.y = updatedNode.targetY;
          }
        });
        // playerList.forEach(function (localNode) {
        //   updatedNodes.forEach(function (updatedNode) {
        //     if (localNode.id === updatedNode.id) {
        //       localNode.x = updatedNode.x;
        //       localNode.y = updatedNode.y;
        //     }          
        //   });
        // });
      });
      
    });
    
    if (!animLoopHandle) {
      animationLoop();
    }
  }
    
})();