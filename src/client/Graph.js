var OPCode = require('common/opCode');

import * as Statistics from 'client/statistics';

class Graph {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = this._canvas.getContext('2d');

    this.screenWidth = this._canvas.width = getDefaultWidth();
    this.screenHeight = this._canvas.height = getDefaultHeight();
    this._xOffset = 0;
    this._yOffset = 0;
    this._borderColor = '#666';
    this._gridColor = '#ececec';
    this._gameWidth = 1000;
    this._gameHeight = 1000;
    this._arenaSize = 500;
    this._scrollSpeed = 4;
    this._scrollLimit = 100;
    this._forcedXOffset = 0;
    this._forcedYOffset = 0;

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

  get xOffset() {
    return this._xOffset + this._forcedXOffset;
  }

  get yOffset() {
    return this._yOffset + this._forcedYOffset;
  }

  get forcedXOffset() {
    return this._forcedXOffset;
  }

  set forcedXOffset(value) {
    this._forcedXOffset = Math.sign(value) * Math.min(this._scrollLimit, Math.abs(value));
  }

  get forcedYOffset() {
    return this._forcedYOffset;
  }

  set forcedYOffset(value) {
    this._forcedYOffset = Math.sign(value) * Math.min(this._scrollLimit, Math.abs(value));
  }

  clear() {
    this._context.fillStyle = 'rgb(255, 255, 255)';
    this._context.fillRect(0, 0, this.screenWidth, this.screenHeight);

    return this;
  }

  updateOffset(scroll) {
    switch (scroll) {
      case OPCode.DIRECTION_NWEST:
        this.forcedXOffset -= this._scrollSpeed;
        this.forcedYOffset -= this._scrollSpeed;
        break;
      case OPCode.DIRECTION_NEAST:
        this.forcedXOffset += this._scrollSpeed;
        this.forcedYOffset -= this._scrollSpeed;
        break;
      case OPCode.DIRECTION_SWEST:
        this.forcedXOffset -= this._scrollSpeed;
        this.forcedYOffset += this._scrollSpeed;
        break;
      case OPCode.DIRECTION_SEAST:
        this.forcedXOffset += this._scrollSpeed;
        this.forcedYOffset += this._scrollSpeed;
        break;
      case OPCode.DIRECTION_WEST:
        this.forcedXOffset -= this._scrollSpeed;
        break;
      case OPCode.DIRECTION_EAST:
        this.forcedXOffset += this._scrollSpeed;
        break;
      case OPCode.DIRECTION_NORTH:
        this.forcedYOffset -= this._scrollSpeed;
        break;
      case OPCode.DIRECTION_SOUTH:
        this.forcedYOffset += this._scrollSpeed;
        break;
      default:
        this.forcedXOffset += Math.sign(this._forcedXOffset) * this._scrollSpeed * -1;
        this.forcedYOffset += Math.sign(this._forcedYOffset) * this._scrollSpeed * -1;
    }

    return this;
  }

  drawDebug(ping) {
    if (this.player.id !== -1) {
      const posX = this.player.position.x;
      const posY = this.player.position.y;
      const velX = this.player.velocity.x;
      const velY = this.player.velocity.y;

      // COORDINATES
      this.drawText(`Coordinates: ${Math.round(posX)} ${Math.round(posY)}`, 30, 50);

      // OFFSET
      this.drawText(`Offset: ${Math.round(this.xOffset)} ${Math.round(this.yOffset)}`, 30, 70);

      // VELOCITY
      this.drawText(`Velocity: ${Math.round(velX)} ${Math.round(velY)}`, 30, 30);

      // SCORE
      var score = 'Score: ' + Statistics.Score.getInstance().currentScore();
      this.drawText(score, 30, 90);

      // SCORE
      this.drawText(`Ping: ${ping} ms`, 30, 110);
    }

    return this;
  }

  drawStatus() {
    if (this.player.id !== -1 && this.player.health === 0) {
      this.drawText('You are dead!', this.screenWidth / 2, 150, 36, true, 'center');
    }
  }

  drawArena() {
    this._context.lineWidth = 2;
    this._context.beginPath();

    var startX = (this._gameWidth - this._arenaSize) / 2 - this.xOffset;
    var startY = (this._gameHeight - this._arenaSize) / 2 - this.yOffset;

    this._context.moveTo(startX, startY);
    this._context.lineTo(startX, startY + this._arenaSize);
    this._context.lineTo(startX + this._arenaSize, startY + this._arenaSize);
    this._context.lineTo(startX + this._arenaSize, startY);
    this._context.lineTo(startX, startY);

    this._context.strokeStyle = '#000';
    this._context.stroke();
    this._context.fillStyle = '#eee';
    this._context.fill();

    this._context.closePath();

    return this;
  }

  drawGrid() {
    this._context.lineWidth = 1;
    this._context.strokeStyle = this._gridColor;
    this._context.beginPath();

    for (var x = -this.xOffset; x < this.screenWidth + this.xOffset; x += 40) {
      x = Math.round(x) + 0.5;
      this._context.moveTo(x, 0);
      this._context.lineTo(x, this.screenHeight);
    }

    for (var y = -this.yOffset; y < this.screenHeight + this.yOffset; y += 40) {
      x = Math.round(y) + 0.5;
      this._context.moveTo(0, y);
      this._context.lineTo(this.screenWidth, y);
    }

    this._context.stroke();

    return this;
  }

  drawText(text, x, y, fontSize, hasStroke = true, align = "start") {
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
    this._context.textAlign = align;
    if (hasStroke) {
      this._context.strokeText(text, x, y);
    }
    this._context.fillText(text, x, y);

    return this;
  }

  drawPlayer(player) {
    const posX = player.position.x - this.xOffset;
    const posY = player.position.y - this.yOffset;

    const arcLength = 2 * (player.health / player.maxHealth) * Math.PI;
    const deficit = (2 * Math.PI - arcLength) / 2;
    const arcStart = player.rotation + deficit;
    const arcEnd = arcLength + player.rotation + deficit;

    let playerColor;
    if (player.health > 0) { 
      playerColor = getColorInRGB(player.color);
    } else {
      playerColor = 'rgb(69, 69, 69)';
    }

    this._context.beginPath();
    this._context.arc(posX, posY, player.radius, 0, 2 * Math.PI);
    this._context.fillStyle = playerColor;
    this._context.fill();
    this._context.closePath();

    this._context.beginPath();
    this._context.arc(posX, posY, player.radius - 3, arcStart, arcEnd);
    this._context.lineWidth = 6;
    this._context.strokeStyle = getHealthColor(player.health, player.maxHealth);
    this._context.stroke();
    this._context.closePath();

    this.drawText(player.name, posX, posY - 40, 14, true, 'center');

    return this;
  }

  drawPlayers(playerList) {
    var currentPlayer = playerList.get(this.player.id, 'id');
    if (currentPlayer) {
      this.player.position.x = currentPlayer.position.x;
      this.player.position.y = currentPlayer.position.y;
      
      this._xOffset = this.player.position.x - this.screenWidth / 2;
      this._yOffset = this.player.position.y - this.screenHeight / 2;
    }
    playerList.forEach(player => this.drawPlayer(player));

    return this;
  }

  drawSpell(spell) {
    var posX = spell.position.x - this.xOffset;
    var posY = spell.position.y - this.yOffset;

    this._context.beginPath();
    this._context.arc(posX, posY, spell.radius, 0, 2 * Math.PI);
    this._context.fillStyle = getColorInRGB(spell.color);
    this._context.fill();
    this._context.closePath();

    return this;
  }

  drawSpells(spellList = []) {
    spellList.forEach(spell => this.drawSpell(spell));

    return this;
  }

};

module.exports = Graph;

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