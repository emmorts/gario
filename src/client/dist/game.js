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
var Graph = (function () {
    
    var spin = 0;
    
    function Graph (canvas, options) {
        this._graph = canvas.getContext('2d');
        
        options = options || {};
        this._lineColor = options.lineColor || '#000000';
        this._globalAlpha = options.globalAlpha || 0.15;
        this._screenWidth = options.screenHeight || window.innerHeight;
        this._screenHeight = options.screenWidth || window.innerWidth;
        this._foodSides = options.virusSides || 10;
        this._virusSides = options.foodSides || 20;
        
        this._playerOptions = {
            border: 6,
            textColor: '#FFFFFF',
            textBorder: '#000000',
            textBorderSize: 3,
            defaultSize: 30
        };
        
        this._player = {
            id: -1,
            x: this._screenWidth / 2,
            y: this._screenHeight / 2,
            screenWidth: this._screenWidth,
            screenHeight: this._screenHeight,
            target: { x: this._screenWidth / 2, y: this._screenHeight / 2 }
        };
    }
    
    Graph.prototype.DrawGrid = function () {
        this._graph.lineWidth = 1;
        this._graph.strokeStyle = this._lineColor;
        this._graph.globalAlpha = this._globalAlpha;
        this._graph.beginPath();

        for (var x = xoffset - this._player.x; x < this._screenWidth; x += this._screenHeight / 18) {
            this._graph.moveTo(x, 0);
            this._graph.lineTo(x, this._screenHeight);
        }

        for (var y = yoffset - this._player.y ; y < this._screenHeight; y += this._screenHeight / 18) {
            this._graph.moveTo(0, y);
            this._graph.lineTo(this._screenWidth, y);
        }

        this._graph.stroke();
        this._graph.globalAlpha = 1;
    }

    Graph.prototype.DrawCircle = function (centerX, centerY, radius, sides) {
        var theta = 0;
        var x = 0;
        var y = 0;

        this._graph.beginPath();

        for (var i = 0; i < sides; i++) {
            theta = (i / sides) * 2 * Math.PI;
            x = centerX + radius * Math.sin(theta);
            y = centerY + radius * Math.cos(theta);
            this._graph.lineTo(x, y);
        }

        this._graph.closePath();
        this._graph.stroke();
        this._graph.fill();
    }

    Graph.prototype.DrawFood = function (food) {
        this._graph.strokeStyle = 'hsl(' + food.hue + ', 100%, 45%)';
        this._graph.fillStyle = 'hsl(' + food.hue + ', 100%, 50%)';
        
        var centerX = food.x - this._player.x + this._screenWidth / 2;
        var centerY = food.y - this._player.y + this._screenHeight / 2;
        
        this.DrawCircle(centerX, centerY, food.radius, this._foodSides);
    }

    Graph.prototype.DrawVirus = function (virus) {
        this._graph.strokeStyle = virus.stroke;
        this._graph.fillStyle = virus.fill;
        this._graph.lineWidth = virus.strokeWidth;
        
        var centerX = virus.x - this._player.x + this._screenWidth / 2;
        var centerY = virus.y - this._player.y + this._screenHeight / 2;
        
        this.DrawCircle(centerX, centerY, virus.radius, this._virusSides);
    }

    Graph.prototype.DrawFireFood = function (mass) {
        this._graph.strokeStyle = 'hsl(' + mass.hue + ', 100%, 45%)';
        this._graph.fillStyle = 'hsl(' + mass.hue + ', 100%, 50%)';
        this._graph.lineWidth = this._playerOptions.border + 10;
        
        var centerX = mass.x - this._player.x + this._screenWidth / 2;
        var centerY = mass.y - this._player.y + this._screenHeight / 2;
        
        this.DrawCircle(centerX, centerY, mass.radius-5, 18 + (~~(mass.masa/5)));
    }

    Graph.prototype.DrawPlayers = function (playerList, order) {
        var start = {
            x: this._player.x - (this._screenWidth / 2),
            y: this._player.y - (this._screenHeight / 2)
        };

        for (var z = 0; z < order.length; z++)
        {
            var currentPlayer = playerList[order[z].nCell];
            var currentCell = playerList[order[z].nCell].cells[order[z].nDiv];

            var x = 0;
            var y = 0;

            var points = 30 + ~~(currentCell.mass / 5);
            var increase = Math.PI * 2 / points;

            this._graph.strokeStyle = 'hsl(' + currentPlayer.hue + ', 100%, 45%)';
            this._graph.fillStyle = 'hsl(' + currentPlayer.hue + ', 100%, 50%)';
            this._graph.lineWidth = this._playerOptions.border;

            var xstore = [];
            var ystore = [];

            spin += 0.0;

            var circle = {
                x: currentCell.x - start.x,
                y: currentCell.y - start.y
            };

            for (var i = 0; i < points; i++) {

                x = currentCell.radius * Math.cos(spin) + circle.x;
                y = currentCell.radius * Math.sin(spin) + circle.y;
                if(typeof(currentPlayer.id) == "undefined") {
                    x = isValueInRange(-currentPlayer.x + this._screenWidth / 2, gameWidth - currentPlayer.x + this._screenWidth / 2, x);
                    y = isValueInRange(-currentPlayer.y + this._screenHeight / 2, gameHeight - currentPlayer.y + this._screenHeight / 2, y);
                } else {
                    x = isValueInRange(-currentCell.x - this._player.x + this._screenWidth/2 + (currentCell.radius/3), gameWidth - currentCell.x + gameWidth - this._player.x + this._screenWidth/2 - (currentCell.radius/3), x);
                    y = isValueInRange(-currentCell.y - this._player.y + this._screenHeight/2 + (currentCell.radius/3), gameHeight - currentCell.y + gameHeight - this._player.y + this._screenHeight/2 - (currentCell.radius/3) , y);
                }
                spin += increase;
                xstore[i] = x;
                ystore[i] = y;
            }
            /*if (wiggle >= this._player.radius/ 3) inc = -1;
            *if (wiggle <= this._player.radius / -3) inc = +1;
            *wiggle += inc;
            */
            for (i = 0; i < points; ++i) {
                if (i === 0) {
                    this._graph.beginPath();
                    this._graph.moveTo(xstore[i], ystore[i]);
                } else if (i > 0 && i < points - 1) {
                    this._graph.lineTo(xstore[i], ystore[i]);
                } else {
                    this._graph.lineTo(xstore[i], ystore[i]);
                    this._graph.lineTo(xstore[0], ystore[0]);
                }

            }
            this._graph.lineJoin = 'round';
            this._graph.lineCap = 'round';
            this._graph.fill();
            this._graph.stroke();
            var nameCell = "";
            if(typeof(currentPlayer.id) == "undefined")
                nameCell = this._player.name;
            else
                nameCell = currentPlayer.name;

            var fontSize = Math.max(currentCell.radius / 3, 12);
            this._graph.lineWidth = this._playerOptions.textBorderSize;
            this._graph.fillStyle = this._playerOptions.textColor;
            this._graph.strokeStyle = this._playerOptions.textBorder;
            this._graph.miterLimit = 1;
            this._graph.lineJoin = 'round';
            this._graph.textAlign = 'center';
            this._graph.textBaseline = 'middle';
            this._graph.font = 'bold ' + fontSize + 'px sans-serif';

            if (toggleMassState === 0) {
                this._graph.strokeText(nameCell, circle.x, circle.y);
                this._graph.fillText(nameCell, circle.x, circle.y);
            } else {
                this._graph.strokeText(nameCell, circle.x, circle.y);
                this._graph.fillText(nameCell, circle.x, circle.y);
                this._graph.font = 'bold ' + Math.max(fontSize / 3 * 2, 10) + 'px sans-serif';
                if (nameCell.length === 0) fontSize = 0;
                this._graph.strokeText(Math.round(currentCell.mass), circle.x, circle.y+fontSize);
                this._graph.fillText(Math.round(currentCell.mass), circle.x, circle.y+fontSize);
            }
        }
    }
    
    function isValueInRange (min, max, value) {
        return Math.min(max, Math.max(min, value));
    }
    
    return Graph;
})();