var graph;
var animLoopHandle;
var playerName;

var userList = [];

var canvasElements = document.getElementsByClassName('js-canvas');
if (canvasElements && canvasElements.length > 0) {
  var canvas = canvasElements[0];
  canvas.addEventListener('mousemove', handleMouseMove);
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
        playerName = playerNameElement.value;
      }
    });
    playButtonElement.addEventListener('mouseup', startGame);
}

function handleMouseMove (mouse) {
  graph.player.target.x = mouse.clientX - graph.screenWidth / 2;
  graph.player.target.y = mouse.clientY - graph.screenHeight / 2;
}

function animationLoop() {
  animLoopHandle = window.requestAnimationFrame(animationLoop);
  
  gameLoop();
}

function gameLoop() {
  graph
    .clear()
    .drawGrid()
    // .drawFood(food)
    // .drawViruses(viruses)
    // .drawFireFood(fireFood)
    .drawPlayers(userList);
}

function startGame () {
  var playerName = playerNameElement.value;
  var startMenuElements = document.getElementsByClassName('js-start-menu');
  if (startMenuElements && startMenuElements.length > 0) {
    startMenuElements[0].style.display = 'none';
  }
  
  var ws = new WSController();

  ws.on('open', function startGame() {
    
    ws.spawn(playerName);
    
    ws.on('joined', function (id) {
      graph.player.id = id;
    });
    
    ws.on('updatePlayers', function (players) {
      userList = players;
    });
    
  });
  
  if (!animLoopHandle) {
    animationLoop();
  }
}