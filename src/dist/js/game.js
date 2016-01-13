var OPCode = {
  "PING": 0x1,
  "PONG": 0x2,
  "SPAWN": 0x3,
  "ADD_NODE": 0x4,
  "UPDATE_NODES": 0x5,
  "PLAYER_MOVE": 0x6
};

if (typeof window === 'undefined') {
    module.exports = OPCode;
} else {
    window.OPCode = OPCode;
}
/* global Buffer */
var BufferCodec = (function () {

  function BufferCodec(buffer) {
    if (!(this instanceof BufferCodec)) {
      return new BufferCodec(buffer);
    }

    this.offset = 0;
    this.jobs = [];

    if (buffer) {
      if (buffer.byteLength > 0) {
        if (typeof Buffer !== 'undefined' && buffer instanceof Buffer) {
          var arrayBuffer = new ArrayBuffer(buffer.length);
          var view = new Uint8Array(arrayBuffer);
          for (var i = 0; i < buffer.length; ++i) {
            view[i] = buffer[i];
          }
          this.buffer = arrayBuffer;
        } else {
          this.buffer = buffer;
        }
      }
      if (!this.buffer) {
        console.warn("Received malformed data");
      }
    }
  }
  
  BufferCodec.prototype.result = function () {
    this.offset = 0;
    
    var bufferLength = this.jobs.reduce(function(last, current) {
      return last + current.length;
    }, 0);
    var buffer = new ArrayBuffer(bufferLength);
    var dataView = new DataView(buffer);
    
    if (this.jobs.length > 0) {
      this.jobs.forEach(function (job) {
        if (job.method !== 'string') {
          dataView[job.method](this.offset, job.data, job.littleEndian);
          this.offset += job.length;
        } else {
          if (job.encoding === 'utf16') {
            for (var i = 0; i < job.length / 2; i++, this.offset += 2) {
              dataView.setUint16(this.offset, job.data.charCodeAt(i), true);
            }
          } else if (job.encoding === 'utf8') {
            for (var i = 0; i < job.length; i++, this.offset++) {
              dataView.setUint8(this.offset, job.data.charCodeAt(i));
            }
          } else {
            console.warn('Undefined encoding: ' + job.encoding);
          }
        }
      }, this);
    }
    
    this.jobs = [];
    
    return dataView.buffer;
  }

  BufferCodec.prototype.string = function (value, encoding) {
    this.jobs.push({
      method: 'string',
      data: value,
      length: (!encoding || encoding === 'utf16') ? value.length * 2 : value.length,
      encoding: encoding ? encoding : 'utf16'
    });

    return this;
  }
  
  BufferCodec.prototype.int8 = function (value) {
    this.jobs.push({
      data: value,
      method: 'setInt8',
      length: 1
    });
    
    return this;
  }
  
  BufferCodec.prototype.uint8 = function (value) {
    this.jobs.push({
      data: value,
      method: 'setUint8',
      length: 1
    });
    
    return this;
  }
  
  BufferCodec.prototype.int16le = function (value) {
    this.jobs.push({
      data: value,
      method: 'setInt16',
      length: 2,
      littleEndian: true
    });
    
    return this;
  }
  
  BufferCodec.prototype.int16be = function (value) {
    this.jobs.push({
      data: value,
      method: 'setInt16',
      length: 2,
      littleEndian: false
    });
    
    return this;
  }
  
  BufferCodec.prototype.uint16le = function (value) {
    this.jobs.push({
      data: value,
      method: 'setUint16',
      length: 2,
      littleEndian: true
    });
    
    return this;
  }
  
  BufferCodec.prototype.uint16be = function (value) {
    this.jobs.push({
      data: value,
      method: 'setUint16',
      length: 2,
      littleEndian: false
    });
    
    return this;
  }
  
  BufferCodec.prototype.int32le = function (value) {
    this.jobs.push({
      data: value,
      method: 'setInt32',
      length: 4,
      littleEndian: true
    });
    
    return this;
  }
  
  BufferCodec.prototype.int32be = function (value) {
    this.jobs.push({
      data: value,
      method: 'setInt32',
      length: 4,
      littleEndian: false
    });
    
    return this;
  }
  
  BufferCodec.prototype.uint32le = function (value) {
    this.jobs.push({
      data: value,
      method: 'setUint32',
      length: 4,
      littleEndian: true
    });
    
    return this;
  }
  
  BufferCodec.prototype.uint32be = function (value) {
    this.jobs.push({
      data: value,
      method: 'setUint32',
      length: 4,
      littleEndian: false
    });
    
    return this;
  }
  
  BufferCodec.prototype.float32le = function (value) {
    this.jobs.push({
      data: value,
      method: 'setFloat32',
      length: 4,
      littleEndian: true
    });
    
    return this;
  }
  
  BufferCodec.prototype.float32be = function (value) {
    this.jobs.push({
      data: value,
      method: 'setFloat32',
      length: 4,
      littleEndian: false
    });
    
    return this;
  }
  
  BufferCodec.prototype.float64le = function (value) {
    this.jobs.push({
      data: value,
      method: 'setFloat64',
      length: 8,
      littleEndian: true
    });
    
    return this;
  }
  
  BufferCodec.prototype.float64be = function (value) {
    this.jobs.push({
      data: value,
      method: 'setFloat64',
      length: 8,
      littleEndian: false
    });
    
    return this;
  }

  BufferCodec.prototype.parse = function (template) {
    if (this.buffer && template) {
      var data = new DataView(this.buffer);
      var result = {};

      if (template.constructor === Array) {
        template.forEach(function (element) {
          parseItem.call(this, element, result)
        }, this);
      } else {
        parseItem.call(this, template, result);
      }

      return result;
    }

    function parseArray(data, template) {
      var result = [];

      var length = data.getUint8(this.offset++);
      if (length > 0) {
        for (var i = 0; i < length; i++) {
          result.push(this.parse(template));
        }
      }

      return result;
    }

    function parseItem(element) {
      var templateResult;
      switch (element.type) {
        case 'int8':
          templateResult = data.getInt8(this.offset);
          this.offset += 1;
          break;
        case 'uint8':
          templateResult = data.getUint8(this.offset);
          this.offset += 1;
          break;
        case 'int16le':
          templateResult = data.getInt16(this.offset, true);
          this.offset += 2;
          break;
        case 'uint16le':
          templateResult = data.getUint16(this.offset, true);
          this.offset += 2;
          break;
        case 'int16be':
          templateResult = data.getInt16(this.offset, false);
          this.offset += 2;
          break;
        case 'uint16be':
          templateResult = data.getUint16(this.offset, false);
          this.offset += 2;
          break;
        case 'int32le':
          templateResult = data.getInt32(this.offset, true);
          this.offset += 4;
          break;
        case 'uint32le':
          templateResult = data.getUint32(this.offset, true);
          this.offset += 4;
          break;
        case 'int32be':
          templateResult = data.getInt32(this.offset, false);
          this.offset += 4;
          break;
        case 'uint32be':
          templateResult = data.getUint32(this.offset, false);
          this.offset += 4;
          break;
        case 'float32le':
          templateResult = data.getFloat32(this.offset, true);
          this.offset += 4;
          break;
        case 'float32be':
          templateResult = data.getFloat32(this.offset, false);
          this.offset += 4;
          break;
        case 'float64le':
          templateResult = data.getFloat64(this.offset, true);
          this.offset += 8;
          break;
        case 'float64be':
          templateResult = data.getFloat64(this.offset, false);
          this.offset += 8;
          break;
        case 'string':
          if (typeof element.length === 'undefined') {
            element.length = data.getUint8(this.offset++);
          } else if (!element.length) {
            templateResult = '';
            break;
          }
          if (!element.encoding || element.encoding === 'utf16') {
            var utf16 = new ArrayBuffer(element.length * 2);
            var utf16view = new Uint16Array(utf16);
            for (var i = 0; i < element.length; i++ , this.offset += 2) {
              utf16view[i] = data.getUint8(this.offset);
            }
            templateResult = String.fromCharCode.apply(null, utf16view);
          } else if (element.encoding === 'utf8') {
            var utf8 = new ArrayBuffer(element.length);
            var utf8view = new Uint8Array(utf8);
            for (var i = 0; i < element.length; i++ , this.offset += 2) {
              utf8view[i] = data.getUint8(this.offset);
            }
            templateResult = String.fromCharCode.apply(null, utf8view);
          }
          break;
        case 'array':
          templateResult = parseArray.call(this, data, element.itemTemplate);
          break;
      }

      if (element.name) {
        result[element.name] = templateResult;
      } else {
        result = templateResult;
      }
    }
  }

  return BufferCodec;

})();

if (typeof window === 'undefined') {
  module.exports = BufferCodec;
}
var Player = (function () {

  function Player(node) {
    node = node || {};
    
    this.id = node.id || -1;
    this.ownerId = node.ownerId || -1;
    this.name = node.name;
    this.health = node.health;
    this.maxHealth = node.maxHealth;
    this.speed = 6;
    this.acceleration = 0.01;
    this.rotation = 0;
    this.targetRotation = 0;
    this.baseFriction = 0.2;
    this.baseRotationTicks = 10;
    this._rotationTicks = this.baseRotationTicks;
    this._friction = this.baseFriction;
    
    this.color = {
      r: node.r || 0,
      g: node.g | 0,
      b: node.b || 0
    };
    
    this.position = {
      x: node.x || 0,
      y: node.y || 0
    };
    
    this.target = {
      x: node.targetX || node.x || 0,
      y: node.targetY || node.y || 0
    };
  }

  Player.prototype.calculateNextPosition = function () {
    if (typeof this.target.x !== 'undefined' && typeof this.target.y !== 'undefined') {
      calculatePosition.call(this);
    }
    if (typeof this.targetRotation !== 'undefined') {
      calculateRotation.call(this);
    }
  }
  
  Player.prototype.setTarget = function (x, y) {
    this.targetRotation = Math.atan2(y - this.position.y, x - this.position.x);
    var diff = this.targetRotation - this.rotation;
    
    if (diff > Math.PI / 2) {
      this._friction = this.baseFriction;
    }
    
    this.target.x = x;
    this.target.y = y;
  }
  
  return Player;
  
  function calculateRotation() {
    if (Math.abs(this.rotation - this.targetRotation) > 1e-5) {
      if (this._rotationTicks > 0) {
        if (this.rotation > Math.PI) {
          this.rotation = -Math.PI - (Math.PI - Math.abs(this.rotation));
        } else if (this.rotation < -Math.PI) {
          this.rotation = Math.PI + (Math.PI - Math.abs(this.rotation));
        }
        if (Math.abs(this.targetRotation - this.rotation) > Math.PI) {
          var diffA = Math.PI - Math.abs(this.rotation);
          var diffB = Math.PI - Math.abs(this.targetRotation);
          var diff = diffA + diffB;
          if (this.rotation > 0) {
            this.rotation += diff / this._rotationTicks;
          } else {
            this.rotation -= diff / this._rotationTicks;
          }
        } else {
          this.rotation += (this.targetRotation - this.rotation) / this._rotationTicks;
        }
      } else {
        this.rotation = this.targetRotation;
        this._rotationTicks = 10
      }
    }
  }

  function calculatePosition() {
    if (!arePositionsApproximatelyEqual(this.position, this.target)) {
      if (this._friction < 1) {
        this._friction += this.acceleration;
      }
      
      var speed = this.speed * this._friction;
      var vX = this.target.x - this.position.x;
      var vY = this.target.y - this.position.y;
      var distance = getHypotenuseLength(vX, vY);
      
      var velX = (vX / distance) * speed;
      var velY = (vY / distance) * speed;
      
      this.position = {
        x: this.position.x + velX,
        y: this.position.y + velY
      };
    } else {
      this._friction = this.baseFriction;
    }
  }
  
  function getQuadrant(radians) {
    if (radians > 0 && radians < Math.PI / 2) {
      return 4;
    } else if (radians >= Math.PI / 2 && radians < Math.PI) {
      return 3
    } else if (radians < -Math.PI / 2 && radians > -Math.PI) {
      return 2;
    } else if (radians < 0 && radians > -Math.PI / 2) {
      return 1;
    }
  }

  function getHypotenuseLength(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }

  function arePositionsApproximatelyEqual(positionA, positionB) {
    var errorMargin = 5;
    return (Math.abs(positionA.x - positionB.x) < errorMargin) && (Math.abs(positionA.y - positionB.y) < errorMargin);
  }
  
})();

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

if (!Date.now) {
  Date.now = function () {
    return new Date().getTime();
  };
}

(function() {
    'use strict';
    
    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                   || window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());
var Graph = (function () {

  function Graph(canvas, options) {
    this._canvas = canvas;
    this._context = this._canvas.getContext('2d');

    options = options || {};
    this.screenWidth = this._canvas.width = options.screenWidth || getDefaultWidth();
    this.screenHeight = this._canvas.height = options.screenHeight || getDefaultHeight();
    this._borderColor = '#666';
    this._gridColor = '#ececec';
    this._globalAlpha = options.globalAlpha || 0.15;
    this._gameWidth = options.gameWidth || 5000;
    this._gameHeight = options.gameHeight || 5000;
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

  Graph.prototype.drawGrid = function () {
    this._context.lineWidth = 1;
    this._context.strokeStyle = this._gridColor;
    this._context.beginPath();

    for (var x = this._xOffset - this.player.position.x; x < this.screenWidth; x += 40.5) {
      x = Math.round(x) + 0.5;
      this._context.moveTo(x, 0);
      this._context.lineTo(x, this.screenHeight);
    }

    for (var y = this._yOffset - this.player.position.y; y < this.screenHeight; y += 40.5) {
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

  Graph.prototype.drawText = function (text, x, y, fontSize, hasStroke) {
    if (typeof fontSize === 'undefined') {
      fontSize = this._playerOptions.fontSize;
    }
    if (typeof hasStroke === 'undefined') {
      hasStroke = true;
    } 
    this._context.lineWidth = this._playerOptions.textBorderSize;
    this._context.fillStyle = this._playerOptions.textColor;
    this._context.strokeStyle = this._playerOptions.textBorder;
    this._context.font = 'bold ' + fontSize + 'px sans-serif';
    this._context.miterLimit = 1;
    this._context.lineJoin = 'round';
    this._context.textAlign = 'center';
    this._context.textBaseline = 'middle';
    if (hasStroke) {
      this._context.strokeText(text, x, y);
    }
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
    this._context.arc(posX, posY, 30, Math.PI / 7 + player.rotation, -Math.PI / 7 + player.rotation);
    this._context.fillStyle = getColorInRGB(player.color);
    this._context.fill();
    this._context.lineWidth = 6;
    this._context.strokeStyle = getHealthColor(player.health, player.maxHealth);
    this._context.stroke();
    this._context.closePath();

    this.drawText(player.name, posX, posY, 16);
    var coordinates = Math.round(player.position.x) + ' ' + Math.round(player.position.y);
    this.drawText(coordinates, posX, posY + 15, 10, false);
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

  return Graph;

})();
/* global BufferCodec */
/* global OPCode */

var WSController = (function () {

  function WSController(options) {
    options = options || {};
    
    this.__uri = options.uri || 'ws://localhost:3000';
    this.__acknoledged = false;
    this.__socket = null;
    this.__eventHandlers = [];

    setupSocket.call(this);
  }

  function setupSocket() {
    this.__socket = new WebSocket(this.__uri);
    this.__socket.binaryType = 'arraybuffer';

    this.__socket.onopen = function (event) {
      fire.call(this, 'open');

      this.__socket.onmessage = function (message) {
        var codec = BufferCodec(message.data);
        var code = codec.parse({ type: 'uint8' });
        
        switch (code) {
          case OPCode.ADD_NODE:
            var node = codec.parse([{
              name: 'id',
              length: 32,
              type: 'string'
            }, {
              name: 'ownerId',
              length: 32,
              type: 'string'
            }, {
              name: 'name',
              type: 'string'
            }, {
              name: 'health',
              type: 'uint16le'
            }, {
              name: 'maxHealth',
              type: 'uint16le'
            }, {
              name: 'x',
              type: 'float32le'
            }, {
              name: 'y',
              type: 'float32le'
            }, {
              name: 'r',
              type: 'uint8'
            }, {
              name: 'g',
              type: 'uint8'
            }, {
              name: 'b',
              type: 'uint8'
            }]);
            fire.call(this, 'addNode', node);
            break;
          case OPCode.UPDATE_NODES:
            var updatedNodes = codec.parse({
              type: 'array',
              itemTemplate: [{
                name: 'id',
                length: 32,
                type: 'string'
              }, {
                name: 'ownerId',
                length: 32,
                type: 'string'
              }, {
                name: 'name',
                type: 'string'
              }, {
                name: 'health',
                type: 'uint16le'
              }, {
                name: 'maxHealth',
                type: 'uint16le'
              }, {
                name: 'x',
                type: 'float32le'
              }, {
                name: 'y',
                type: 'float32le'
              }, {
                name: 'targetX',
                type: 'float32le'
              }, {
                name: 'targetY',
                type: 'float32le'
              }, {
                name: 'r',
                type: 'uint8'
              }, {
                name: 'g',
                type: 'uint8'
              }, {
                name: 'b',
                type: 'uint8'
              }]
            });
            var destroyedNodes = codec.parse({
              type: 'array',
              itemTemplate: { type: 'string', length: 32 }
            });
            fire.call(this, 'updateNodes', {
              updatedNodes: updatedNodes,
              destroyedNodes: destroyedNodes
            });
            break;
          default:
            console.warn("Undefined opcode");
            break;
        }
      }.bind(this)
    }.bind(this)
  }
  
  WSController.prototype.spawn = function (playerName) {
    var buffer = BufferCodec()
      .uint8(OPCode.SPAWN)
      .uint8(playerName.length)
      .string(playerName)
      .result();
    // var buffer = new ArrayBuffer(2 + playerName.length * 2);
    // var uint8view = new Uint8Array(buffer); 
    // uint8view[0] = OPCode.SPAWN;
    // uint8view[1] = playerName.length;
    // if (playerName.length > 0) {
    //   var bufferView = new Uint16Array(buffer, 2);
    //   for (var i = 0, strLen = playerName.length; i < strLen; i++) {
    //     bufferView[i] = playerName.charCodeAt(i);
    //   }
    // }
    this.__socket.send(buffer);
  }
  
  WSController.prototype.move = function (player) {
    var buffer = BufferCodec()
      .uint8(OPCode.PLAYER_MOVE)
      .float32le(player.target.x)
      .float32le(player.target.y)
      .result();
      
    this.__socket.send(buffer);
  }
  
  WSController.prototype.on = function (name, listener) {
    if (!(name in this.__eventHandlers) || !(this.__eventHandlers[name] instanceof Array)) {
      this.__eventHandlers[name] = [];
    }
    this.__eventHandlers[name].push(listener);
  }
  
  function fire(name, options) {
    if (name in this.__eventHandlers && this.__eventHandlers[name].length > 0) {
      this.__eventHandlers[name].forEach(function (handler) {
        handler(options);
      });
    }
  }

  return WSController;

})();
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
    
    playerList.forEach(function (player) {
      // var posX = player.position.x;
      // var posY = player.position.y;
      
      player.calculateNextPosition();
      
      // if (currentPlayer === player) {
      //   var now = performance.now();
      //   var diff = now - moveTick;
      //   if (diff > 100 && (player.position.x !== posX || player.position.y !== posY)) {
      //     ws.move(player);
      //     moveTick = now;
      //   }
      // }
      
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
            ws.move(currentPlayer);
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
      
      ws.on('updateNodes', function (nodes) {
        var updatedNodes = nodes.updatedNodes;
        if (updatedNodes && updatedNodes.length > 0) {
          updatedNodes.forEach(function (updatedNode) {
            var found = playerList.filter(function (player) {
              return player.id === updatedNode.id;
            });
            if (found.length === 0) {
              var player = new Player(updatedNode);
              playerList.splice(0, 0, player);
            } else {
              found[0].setTarget(updatedNode.targetX, updatedNode.targetY);
            }
          });
        }
        
        var destroyedNodes = nodes.destroyedNodes;
        if (destroyedNodes && destroyedNodes.length > 0) {
          destroyedNodes.forEach(function (destroyedNode) {
            var index = -1;
            for (var i = 0; i < playerList.length; i++) {
              if (playerList[i].id === destroyedNode.id) {
                index = i;
              }
            }
            playerList.splice(index, 1);
          });
        }
      });
      
    });
    
    if (!animLoopHandle) {
      animationLoop();
    }
  }
    
})();