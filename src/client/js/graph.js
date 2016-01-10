var Graph = (function () {

  function Graph(canvas, options) {
    this._context = canvas.getContext('2d');

    options = options || {};
    this.screenWidth = canvas.width = options.screenWidth || getDefaultWidth();
    this.screenHeight = canvas.height = options.screenHeight || getDefaultHeight();
    this._lineColor = options.lineColor || '#000000';
    this._globalAlpha = options.globalAlpha || 0.15;
    this._foodSides = options.virusSides || 10;
    this._virusSides = options.foodSides || 20;
    this._gameWidth = options.gameWidth || 5000;
    this._gameHeight = options.gameHeight || 5000;
    this._xOffset = -this._gameWidth;
    this._yOffset = -this._gameHeight;

    this.player = {
      id: -1,
      position: {
        x: this.screenWidth / 2,
        y: this.screenHeight / 2
      }
      // screenWidth: this.screenWidth,
      // screenHeight: this.screenHeight,
      // target: { x: this.screenWidth / 2, y: this.screenHeight / 2 }
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

  Graph.prototype.drawGrid = function () {
    this._context.lineWidth = 1;
    this._context.strokeStyle = this._lineColor;
    this._context.globalAlpha = this._globalAlpha;
    this._context.beginPath();

    for (var x = this._xOffset - this.player.position.x; x < this.screenWidth; x += this.screenHeight / 16) {
      x = Math.round(x) + 0.5;
      this._context.moveTo(x, 0);
      this._context.lineTo(x, this.screenHeight);
    }

    for (var y = this._yOffset - this.player.position.y; y < this.screenHeight; y += this.screenHeight / 16) {
      x = Math.round(y) + 0.5;
      this._context.moveTo(0, y);
      this._context.lineTo(this.screenWidth, y);
    }

    this._context.stroke();
    this._context.globalAlpha = 1;

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
      this._context.strokeStyle = this._lineColor;
      this._context.stroke();
    }

    // Top-horizontal.
    if (this.player.position.y <= this.screenHeight / 2) {
      this._context.beginPath();
      this._context.moveTo(this.screenWidth / 2 - this.player.position.x, this.screenHeight / 2 - this.player.position.y);
      this._context.lineTo(this._gameWidth + this.screenWidth / 2 - this.player.position.x, this.screenHeight / 2 - this.player.position.y);
      this._context.strokeStyle = this._lineColor;
      this._context.stroke();
    }

    // Right-vertical.
    if (this._gameWidth - this.player.position.x <= this.screenWidth / 2) {
      this._context.beginPath();
      this._context.moveTo(this._gameWidth + this.screenWidth / 2 - this.player.position.x, this.screenHeight / 2 - this.player.position.y);
      this._context.lineTo(this._gameWidth + this.screenWidth / 2 - this.player.position.x, this._gameHeight + this.screenHeight / 2 - this.player.position.y);
      this._context.strokeStyle = this._lineColor;
      this._context.stroke();
    }

    // Bottom-horizontal.
    if (this._gameHeight - this.player.position.y <= this.screenHeight / 2) {
      this._context.beginPath();
      this._context.moveTo(this._gameWidth + this.screenWidth / 2 - this.player.position.x, this._gameHeight + this.screenHeight / 2 - this.player.position.y);
      this._context.lineTo(this.screenWidth / 2 - this.player.position.x, this._gameHeight + this.screenHeight / 2 - this.player.position.y);
      this._context.strokeStyle = this._lineColor;
      this._context.stroke();
    }
    
    return this;
  }

  Graph.prototype.drawText = function (text, x, y, fontSize) {
    if (!fontSize) {
      fontSize = this._playerOptions.fontSize;
    }
    this._context.lineWidth = this._playerOptions.textBorderSize;
    this._context.fillStyle = this._playerOptions.textColor;
    this._context.strokeStyle = this._playerOptions.textBorder;
    this._context.font = 'bold ' + fontSize + 'px sans-serif';
    this._context.miterLimit = 1;
    this._context.lineJoin = 'round';
    this._context.textAlign = 'center';
    this._context.textBaseline = 'middle';
    this._context.strokeText(text, x, y);
    this._context.fillText(text, x, y);
  }

  Graph.prototype.drawPlayer = function (player) {
    var start = {
      x: this.player.position.x - (this.screenWidth / 2),
      y: this.player.position.y - (this.screenHeight / 2)
    };

    var posX = -start.x + player.position.x;
    var posY = -start.y + player.position.y;

    this._context.beginPath();
    // TODO: REMOVE HARDCODED RADIUS
    this._context.arc(posX, posY, 50, Math.PI / 7 + player.rotation, -Math.PI / 7 + player.rotation);
    this._context.fillStyle = getColorInRGB(player.color);
    this._context.fill();
    this._context.lineWidth = 6;
    this._context.strokeStyle = getColorInRGB(player.color, -0.15);
    this._context.stroke();
    this._context.lineWidth = 3;
    this._context.strokeStyle = getColorInRGB(player.color, 0.15);
    this._context.stroke();
    this._context.closePath();

    this.drawText(player.name, posX, posY, 16);
    var coordinates = Math.round(player.position.x) + ' ' + Math.round(player.position.y);
    this.drawText(coordinates, posX, posY + 25);
  }

  Graph.prototype.drawPlayers = function (playerList) {
    if (playerList.length > 0) {
      var currentPlayer = playerList.find(function (player) {
        return player.id === this.player.id;
      }, this);
      if (currentPlayer) {
        this.player.position.x = currentPlayer.position.x;
        this.player.position.y = currentPlayer.position.y;
      }
      playerList.forEach(function (player) {
        this.drawPlayer(player);
      }, this);
    }

    return this;
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

  return Graph;

})();