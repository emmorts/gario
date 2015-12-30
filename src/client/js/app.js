var graph;
var animLoopHandle;
var ws = new WSController();

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var gameWidth = 0;
var gameHeight = 0;

var gameStart = false;
var disconnected = false;
var died = false;
var kicked = false;

var continuity = false;
var startPingTime = 0;
var toggleMassState = 0;
var spin = -Math.PI;
var enemySpin = -Math.PI;

var foodSides = 10;
var virusSides = 20;

var foodConfig = {
  border: 0,
};

var playerConfig = {
  border: 6,
  textColor: '#FFFFFF',
  textBorder: '#000000',
  textBorderSize: 3,
  defaultSize: 30
};

var player = {
  id: -1,
  x: screenWidth / 2,
  y: screenHeight / 2,
  screenWidth: screenWidth,
  screenHeight: screenHeight,
  target: { x: screenWidth / 2, y: screenHeight / 2 }
};

var food = [];
var viruses = [];
var fireFood = [];
var userList = [];
var leaderboard = [];
var target = { x: player.x, y: player.y };
var reenviar = true;
var directionLock = false;
var directions = [];

var gameLoopInterval = 1000 / 60;

var canvasElements = document.getElementsByClassName('js-canvas');
if (canvasElements && canvasElements.length > 0) {
  graph = new Graph(canvasElements[0]);
  // canvas.addEventListener('mousemove', gameInput, false);
  // canvas.addEventListener('mouseout', outOfBounds, false);
  // canvas.addEventListener('keypress', keyInput, false);
  // canvas.addEventListener('keyup', function(event) { reenviar = true; directionUp(event); }, false);
  // canvas.addEventListener('keydown', directionDown, false);
  // canvas.addEventListener('touchstart', touchInput, false);
  // canvas.addEventListener('touchmove', touchInput, false);
}

window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, gameLoopInterval);
    };
})();

window.cancelAnimFrame = (function (handle) {
  return window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame;
})();

function animloop() {
  animLoopHandle = window.requestAnimFrame(animloop);
  gameLoop();
}

function gameLoop() {
  if (!disconnected) {
    graph
      .clear()
      .drawGrid()
      .drawFood(food)
      .drawViruses(viruses)
      .drawFireFood(fireFood);

    var orderMass = [];
    for (var i = 0; i < userList.length; i++) {
      for (var j = 0; j < userList[i].cells.length; j++) {
        orderMass.push({
          nCell: i,
          nDiv: j,
          mass: userList[i].cells[j].mass
        });
      }
    }
    orderMass.sort(function (obj1, obj2) {
      return obj1.mass - obj2.mass;
    });

    graph.drawPlayers(userList, orderMass);
  }
}

ws.on('open', function startGame () {
  if (!animLoopHandle) {
    animloop();
  }
  
  ws.on('acknowledged', function () {
    ws.spawn();
  });
  
  ws.on('updatePlayers', function (players) {
    userList = players;
  });
  
});