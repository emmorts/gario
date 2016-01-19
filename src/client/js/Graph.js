function Graph(canvas, options) {
  this._canvas = canvas;
  this._context = this._canvas.getContext('2d');

  options = options || {};
  this.screenWidth = this._canvas.width = options.screenWidth || getDefaultWidth();
  this.screenHeight = this._canvas.height = options.screenHeight || getDefaultHeight();
  this._borderColor = '#666';
  this._gridColor = '#ececec';
  this._globalAlpha = options.globalAlpha || 0.15;
  this._gameWidth = this.screenWidth || 1000;
  this._gameHeight = this.screenHeight || 1000;
  this._arenaSize = 500;
  this._xOffset = -this._gameWidth;
  this._yOffset = -this._gameHeight;
  
  window.addEventListener('resize', onResize.bind(this));

  this.player = {
    id: -1,
    position: {
      x: this.screenWidth / 2,
      y: this.screenHeight / 2
    }
  };

  this._playerOptions = {
    border: 6,
    borderColor: '#CCCCCC',
    textColor: '#FFFFFF',
    textBorder: '#000000',
    textBorderSize: 3,
    fontSize: 12,
    defaultSize: 30
  };
}

Graph.prototype.clear = function () {
  this._context.fillStyle = 'rgb(255, 255, 255)';
  this._context.fillRect(0, 0, this.screenWidth, this.screenHeight);

  return this;
}

Graph.prototype.drawDebug = function () {
  if (this.player.id !== -1) {
    // COORDINATES
    var posX = this.player.position.x;
    var posY = this.player.position.y;
    var coordinates = 'Coordinates: ' + Math.round(posX) + ' ' + Math.round(posY);
    this.drawText(coordinates, 50, 50);
    
    // VELOCITY
    var velocity = 'Velocity: ' + Math.round(this.player.velocity.x) + ' ' + Math.round(this.player.velocity.y);
    this.drawText(velocity, 50, 30);
  }
  
  return this;
}

Graph.prototype.drawArena = function () {
  this._context.lineWidth = 2;
  this._context.strokeStyle = '#000';
  this._context.beginPath();
  
  var startX = (this._gameWidth - this._arenaSize) / 2;
  var startY = (this._gameHeight - this._arenaSize) / 2;
  
  this._context.moveTo(startX, startY);
  this._context.lineTo(startX, startY + this._arenaSize);
  this._context.lineTo(startX + this._arenaSize, startY + this._arenaSize);
  this._context.lineTo(startX + this._arenaSize, startY);
  this._context.lineTo(startX, startY);
  
  this._context.stroke();
  
  return this;
}

Graph.prototype.drawGrid = function () {
  this._context.lineWidth = 1;
  this._context.strokeStyle = this._gridColor;
  this._context.beginPath();

  for (var x = this._xOffset; x < this.screenWidth; x += 40.5) {
    x = Math.round(x) + 0.5;
    this._context.moveTo(x, 0);
    this._context.lineTo(x, this.screenHeight);
  }

  for (var y = this._yOffset; y < this.screenHeight; y += 40.5) {
    x = Math.round(y) + 0.5;
    this._context.moveTo(0, y);
    this._context.lineTo(this.screenWidth, y);
  }

  this._context.stroke();

  return this;
}

Graph.prototype.drawCircle = function (centerX, centerY, radius, sides) {
  var theta = 0;
  var x = 0;
  var y = 0;

  this._context.beginPath();

  for (var i = 0; i < sides; i++) {
    theta = (i / sides) * 2 * Math.PI;
    x = centerX + radius * Math.sin(theta);
    y = centerY + radius * Math.cos(theta);
    this._context.lineTo(x, y);
  }

  this._context.closePath();
  this._context.stroke();
  this._context.fill();

  return this;
}

Graph.prototype.drawBorder = function () {

  this._context.lineWidth = 1;
  this._context.strokeStyle = this._playerOptions.borderColor;

  // Left-vertical.
  if (this.player.position.x <= this.screenWidth / 2) {
    this._context.beginPath();
    this._context.moveTo(this.screenWidth / 2 - this.player.position.x, this.screenHeight / 2 - this.player.position.y);
    this._context.lineTo(this.screenWidth / 2 - this.player.position.x, this._gameHeight + this.screenHeight / 2 - this.player.position.y);
    this._context.strokeStyle = this._borderColor;
    this._context.stroke();
  }

  // Top-horizontal.
  if (this.player.position.y <= this.screenHeight / 2) {
    this._context.beginPath();
    this._context.moveTo(this.screenWidth / 2 - this.player.position.x, this.screenHeight / 2 - this.player.position.y);
    this._context.lineTo(this._gameWidth + this.screenWidth / 2 - this.player.position.x, this.screenHeight / 2 - this.player.position.y);
    this._context.strokeStyle = this._borderColor;
    this._context.stroke();
  }

  // Right-vertical.
  if (this._gameWidth - this.player.position.x <= this.screenWidth / 2) {
    this._context.beginPath();
    this._context.moveTo(this._gameWidth + this.screenWidth / 2 - this.player.position.x, this.screenHeight / 2 - this.player.position.y);
    this._context.lineTo(this._gameWidth + this.screenWidth / 2 - this.player.position.x, this._gameHeight + this.screenHeight / 2 - this.player.position.y);
    this._context.strokeStyle = this._borderColor;
    this._context.stroke();
  }

  // Bottom-horizontal.
  if (this._gameHeight - this.player.position.y <= this.screenHeight / 2) {
    this._context.beginPath();
    this._context.moveTo(this._gameWidth + this.screenWidth / 2 - this.player.position.x, this._gameHeight + this.screenHeight / 2 - this.player.position.y);
    this._context.lineTo(this.screenWidth / 2 - this.player.position.x, this._gameHeight + this.screenHeight / 2 - this.player.position.y);
    this._context.strokeStyle = this._borderColor;
    this._context.stroke();
  }
  
  return this;
}

Graph.prototype.drawText = function (text, x, y, fontSize, hasStroke = true) {
  if (typeof fontSize === 'undefined') {
    fontSize = this._playerOptions.fontSize;
  }
  this._context.lineWidth = this._playerOptions.textBorderSize;
  this._context.fillStyle = this._playerOptions.textColor;
  this._context.strokeStyle = this._playerOptions.textBorder;
  this._context.font = 'bold ' + fontSize + 'px sans-serif';
  this._context.miterLimit = 1;
  this._context.lineJoin = 'round';
  this._context.textBaseline = 'middle';
  if (hasStroke) {
    this._context.strokeText(text, x, y);
  }
  this._context.fillText(text, x, y);
}

Graph.prototype.drawPlayer = function (player) {
  var posX = player.position.x;
  var posY = player.position.y;

  this._context.beginPath();
  this._context.arc(posX, posY, player.radius, Math.PI / 7 + player.rotation, -Math.PI / 7 + player.rotation);
  this._context.fillStyle = getColorInRGB(player.color);
  this._context.fill();
  this._context.lineWidth = 6;
  this._context.strokeStyle = getHealthColor(player.health, player.maxHealth);
  this._context.stroke();
  this._context.closePath();

  this._context.textAlign = 'center';
  this.drawText(player.name, posX, posY - 40, 14);
  this._context.textAlign = 'left';
}

Graph.prototype.drawPlayers = function (playerList) {
  if (playerList.length > 0) {
    var currentPlayer = playerList.find(player => player.id === this.player.id);
    if (currentPlayer) {
      this.player.position.x = currentPlayer.position.x;
      this.player.position.y = currentPlayer.position.y;
    }
    playerList.forEach(player => this.drawPlayer(player));
  }

  return this;
}

Graph.prototype.drawSpells = function (spellList) {
  if (spellList && spellList.length > 0) {
    spellList.forEach(spell => drawSpell.call(this, spell));
  }
  
  return this;
}

function drawSpell(spell) {
  var posX = spell.position.x;
  var posY = spell.position.y;
  
  this._context.beginPath();
  this._context.arc(posX, posY, spell.radius, 0, 2 * Math.PI);
  this._context.fillStyle = getColorInRGB(spell.color);
  this._context.fill();
  this._context.closePath();
}

function getColorInRGB(color, lightenPct) {
  if (color) {
    var r = color.r,
      g = color.g,
      b = color.b;
    if (lightenPct) {
      r = Math.round(r - r * lightenPct);
      g = Math.round(g - g * lightenPct);
      b = Math.round(b - b * lightenPct);
    }
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }
  return 'rgb(0, 0, 0)';
}

function getHealthColor(health, maxHealth) {
  var hue = Math.floor((health / maxHealth) * 120);
  
  return 'hsl(' + hue + ', 100%, 50%)';
}

function onResize() {
  this.screenWidth = this._canvas.width = getDefaultWidth();
  this.screenHeight = this._canvas.height = getDefaultHeight();
}

function isValueInRange(min, max, value) {
  return Math.min(max, Math.max(min, value));
}

function getDefaultWidth() {
  return window.innerWidth && document.documentElement.clientWidth
    ? Math.min(window.innerWidth, document.documentElement.clientWidth)
    : window.innerWidth ||
    document.documentElement.clientWidth ||
    document.getElementsByTagName('body')[0].clientWidth;
}

function getDefaultHeight() {
  return window.innerHeight && document.documentElement.clientHeight
    ? Math.min(window.innerHeight, document.documentElement.clientHeight)
    : window.innerHeight ||
    document.documentElement.clientHeight ||
    document.getElementsByTagName('body')[0].clientHeight;
}

module.exports = Graph;