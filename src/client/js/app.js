var socket = new WebSocket('ws://localhost:3000');
socket.binaryType = 'arraybuffer';

socket.onopen = function (event) {
    console.log('socket is open');
    socket.send("woow");
}
var canvas;
var graph;
var animLoopHandle;

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var gameWidth = 0;
var gameHeight = 0;
var xoffset = -gameWidth;
var yoffset = -gameHeight;

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
    target: {x: screenWidth / 2, y: screenHeight / 2}
};

var foods = [];
var viruses = [];
var fireFood = [];
var users = [];
var leaderboard = [];
var target = {x: player.x, y: player.y};
var reenviar = true;
var directionLock = false;
var directions = [];

var gameLoopInterval = 1000 / 60;

var canvasElements = document.getElementsByClassName('js-canvas');
if (canvasElements && canvasElements.length > 0) {
    canvas = canvasElements[0];
    canvas.width = screenWidth; canvas.height = screenHeight;
    // canvas.addEventListener('mousemove', gameInput, false);
    // canvas.addEventListener('mouseout', outOfBounds, false);
    // canvas.addEventListener('keypress', keyInput, false);
    // canvas.addEventListener('keyup', function(event) { reenviar = true; directionUp(event); }, false);
    // canvas.addEventListener('keydown', directionDown, false);
    // canvas.addEventListener('touchstart', touchInput, false);
    // canvas.addEventListener('touchmove', touchInput, false);
}

function outOfBounds() {
    if (!continuity) {
        target = { x : 0, y: 0 };
    }
}

function valueInRange(min, max, value) {
    return Math.min(max, Math.max(min, value));
}

var graph = canvas.getContext('2d');

window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.msRequestAnimationFrame     ||
            function (callback) {
                window.setTimeout(callback, gameLoopInterval);
            };
})();

window.cancelAnimFrame = (function(handle) {
    return  window.cancelAnimationFrame     ||
            window.mozCancelAnimationFrame;
})();

function animloop() {
    animLoopHandle = window.requestAnimFrame(animloop);
    gameLoop();
}

function gameLoop() {
    if (!disconnected) {
        graph.fillStyle = '#ffffff';
        graph.fillRect(0, 0, screenWidth, screenHeight);

        drawGrid();
        foods.forEach(drawFood);
        viruses.forEach(drawVirus);
        fireFood.forEach(drawFireFood);
        
        var orderMass = [];
        for(var i=0; i<users.length; i++) {
            for(var j=0; j<users[i].cells.length; j++) {
                orderMass.push({
                    nCell: i,
                    nDiv: j,
                    mass: users[i].cells[j].mass
                });
            }
        }
        orderMass.sort(function(obj1, obj2) {
            return obj1.mass - obj2.mass;
        });

        drawPlayers(orderMass);
        // socket.emit('0', target); // playerSendTarget "Heartbeat".
    }
}

(function startGame() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    
    if (!animLoopHandle)
        animloop();
        
    socket.emit('respawn');
})();