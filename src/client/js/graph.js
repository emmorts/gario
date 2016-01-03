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
    this._gameWidth = options.gameWidth || this.screenWidth;
    this._gameHeight = options.gameHeight || this.screenHeight;
    this._xOffset = -this._gameWidth;
    this._yOffset = -this._gameHeight;
    
    this.player = {
      id: -1,
      x: this.screenWidth / 2,
      y: this.screenHeight / 2,
      screenWidth: this.screenWidth,
      screenHeight: this.screenHeight,
      target: { x: this.screenWidth / 2, y: this.screenHeight / 2 }
    };

    this._playerOptions = {
      border: 6,
      textColor: '#FFFFFF',
      textBorder: '#000000',
      textBorderSize: 3,
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

    for (var x = this._xOffset - this.player.x; x < this.screenWidth; x += this.screenHeight / 18) {
      this._context.moveTo(x, 0);
      this._context.lineTo(x, this.screenHeight);
    }

    for (var y = this._yOffset - this.player.y; y < this.screenHeight; y += this.screenHeight / 18) {
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

  Graph.prototype.drawFood = function (food) {
    if (food) {
      if (food.constructor !== Array) {
        food = [food];
      }

      food.forEach(function (item) {
        this._context.strokeStyle = 'hsl(' + food.hue + ', 100%, 45%)';
        this._context.fillStyle = 'hsl(' + food.hue + ', 100%, 50%)';

        var centerX = food.x - this.player.x + this.screenWidth / 2;
        var centerY = food.y - this.player.y + this.screenHeight / 2;

        this.drawCircle(centerX, centerY, food.radius, this._foodSides);
      });
    }

    return this;
  }

  Graph.prototype.drawViruses = function (viruses) {
    if (viruses) {
      if (viruses.constructor !== Array) {
        viruses = [viruses];
      }

      viruses.forEach(function (virus) {
        this._context.strokeStyle = virus.stroke;
        this._context.fillStyle = virus.fill;
        this._context.lineWidth = virus.strokeWidth;

        var centerX = virus.x - this.player.x + this.screenWidth / 2;
        var centerY = virus.y - this.player.y + this.screenHeight / 2;

        this.drawCircle(centerX, centerY, virus.radius, this._virusSides);
      });
    }

    return this;
  }

  Graph.prototype.drawFireFood = function (masses) {
    if (masses) {
      if (masses.constructor !== Array) {
        masses = [masses];
      }

      masses.forEach(function (mass) {
        this._context.strokeStyle = 'hsl(' + mass.hue + ', 100%, 45%)';
        this._context.fillStyle = 'hsl(' + mass.hue + ', 100%, 50%)';
        this._context.lineWidth = this._playerOptions.border + 10;

        var centerX = mass.x - this.player.x + this.screenWidth / 2;
        var centerY = mass.y - this.player.y + this.screenHeight / 2;

        this.drawCircle(centerX, centerY, mass.radius - 5, 18 + (~~(mass.masa / 5)));
      });
    }

    return this;
  }
  
  Graph.prototype.drawText = function (text, x, y) {
    this._context.lineWidth = this._playerOptions.textBorderSize;
    this._context.fillStyle = this._playerOptions.textColor;
    this._context.strokeStyle = this._playerOptions.textBorder;
    this._context.miterLimit = 1;
    this._context.lineJoin = 'round';
    this._context.textAlign = 'center';
    this._context.textBaseline = 'middle';
    this._context.strokeText(text, x, y);
    this._context.fillText(text, x, y);
  }
  
  Graph.prototype.drawPlayer = function (player) {
    var start = {
      x: this.player.x - (this.screenWidth / 2),
      y: this.player.y - (this.screenHeight / 2)
    };
    
    if (player && player.cells && player.cells.length > 0) {
      player.cells.forEach(function (playerCell) {
        var posX = -start.x + playerCell.x;
        var posY = -start.y + playerCell.y;
        
        this._context.beginPath();
        this._context.arc(posX, posY, playerCell.radius, 0, 2 * Math.PI);
        this._context.fillStyle = 'hsl(' + player.hue + ', 100%, 50%)';
        this._context.fill();
        this._context.lineWidth = 5;
        this._context.strokeStyle = 'hsl(' + player.hue + ', 100%, 35%)';
        this._context.stroke();
        this._context.closePath();
        
        var text = Math.round(playerCell.x) + ' ' + Math.round(playerCell.y);
        this.drawText(text, posX, posY);
      }, this);
    }
  }

  Graph.prototype.drawPlayers = function (playerList) {
    if (playerList.length > 0) {
      var currentPlayer = playerList.find(function (player) {
        return player.id === this.player.id;
      }, this);
      if (currentPlayer) {
        this.player.x = currentPlayer.x;
        this.player.y = currentPlayer.y;
      }
      playerList.forEach(function (player) {
        this.drawPlayer(player);
      }, this);
    }
    
    return this;
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