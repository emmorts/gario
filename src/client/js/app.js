/* global Graph */
(function () {
  
  var graph;
  var animLoopHandle;
  var time = performance.now();
  var mouse = { x: 0, y: 0 };

  var playerList = [];
  var player = null;

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
    if (player) {
      player.calculateNextPosition();  
    }
    
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
    
    var ws = new WSController();

    ws.on('open', function startGame() {
      
      canvas.addEventListener('mousedown', function (event) {
        if (player && event.button === 2 && (mouse.x !== event.x || mouse.y !== event.y)) {
          event.preventDefault();
          event.stopPropagation();
          var now = performance.now();
          var diff = now - time;
          if (diff > 100) {
            var targetX = player.position.x + event.x - graph.screenWidth / 2;
            var targetY = player.position.y + event.y - graph.screenHeight / 2;
            targetX = Math.min(Math.max(targetX, 0), graph._gameWidth);
            targetY = Math.min(Math.max(targetY, 0), graph._gameHeight);
            player.setTarget(targetX, targetY);
            // targetX = targetX < 0 ? 0 : targetX;
            // targetY = targetY < 0 ? 0 : targetY;
            // player.target = {
            //   x: Math.min(targetX, graph._gameWidth),
            //   y: Math.min(targetY, graph._gameHeight)
            // };
            time = now;
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
        player = new Player(node);
        graph.player = player;
        playerList.push(player);
      });
      
      ws.on('updateNodes', function (updatedNodes) {
        playerList.forEach(function (localNode) {
          updatedNodes.forEach(function (updatedNode) {
            if (localNode.id === updatedNode.id) {
              localNode.x = updatedNode.x;
              localNode.y = updatedNode.y;
            }          
          });
        });
      });
      
    });
    
    if (!animLoopHandle) {
      animationLoop();
    }
  }
    
})();