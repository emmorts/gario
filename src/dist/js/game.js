(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function BufferCodec(buffer) {
  if (!(this instanceof BufferCodec)) {
    return new BufferCodec(buffer);
  }

  this.offset = 0;
  this.jobs = [];

  if (buffer) {
    if (buffer.byteLength > 0) {
      if (buffer instanceof ArrayBuffer) {
        this.buffer = buffer;
      } else {
        var arrayBuffer = new ArrayBuffer(buffer.length);
        var view = new Uint8Array(arrayBuffer);
        for (var i = 0; i < buffer.length; ++i) {
          view[i] = buffer[i];
        }
        this.buffer = arrayBuffer;
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

BufferCodec.prototype.parse = function (template, transform) {
  if (this.buffer && template) {
    var data = new DataView(this.buffer);
    var result = {}, element = {};
    
    if (template.constructor === Object) {
      for (var propertyName in template) {
        element = {
          name: propertyName
        };
        
        if (template[propertyName].constructor === Array) {
          element.type = 'array'
          element.itemTemplate = template[propertyName][0];
        } else if (template[propertyName].constructor === String) {
          element.type = template[propertyName];
        } else if (template[propertyName].constructor === Object) {
          for (var innerPropertyName in template[propertyName]) {
            element[innerPropertyName] = template[propertyName][innerPropertyName];
          }
        }
        
        parseItem.call(this, element, result);
      }
    } else if (template.constructor === Array) {
      element = {
        type: 'array',
        itemTemplate: template[0]
      };
      
      parseItem.call(this, element, result);
    }
    
    if (transform) {
      return transform(result);
    } else {
      return result;
    }
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
      default:
        console.error('Type ' + element.type + ' is not supported.');
    }

    if (element.name) {
      result[element.name] = templateResult;
    } else {
      result = templateResult;
    }
  }
}

module.exports = BufferCodec;
},{}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DomElement = function () {
  function DomElement(query, elementClass) {
    _classCallCheck(this, DomElement);

    this.htmlElement = null;
    this.instance = null;
    this._eventHandlers = [];

    if (query) {
      this.htmlElement = window.document.querySelector(query);

      if (this.htmlElement && elementClass) {
        this.instance = new elementClass(this.htmlElement);
      }
    }
  }

  _createClass(DomElement, [{
    key: "on",
    value: function on(name, listener) {
      if (!(name in this._eventHandlers) || !(this._eventHandlers[name] instanceof Array)) {
        this._eventHandlers[name] = [];
      }
      if (! ~this._eventHandlers[name].indexOf(listener)) {
        this._eventHandlers[name].push(listener);

        this.htmlElement.addEventListener(name, listener);
      }

      return this;
    }
  }]);

  return DomElement;
}();

exports.default = DomElement;

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OPCode = require('../../opCode');

var Graph = function () {
  function Graph(canvas) {
    _classCallCheck(this, Graph);

    this._canvas = canvas;
    this._context = this._canvas.getContext('2d');

    this.screenWidth = this._canvas.width = getDefaultWidth();
    this.screenHeight = this._canvas.height = getDefaultHeight();
    this.xOffset = 0;
    this.yOffset = 0;
    this._borderColor = '#666';
    this._gridColor = '#ececec';
    this._globalAlpha = 0.15;
    this._gameWidth = 1000;
    this._gameHeight = 1000;
    this._arenaSize = 500;
    this.__scrollSpeed = 4;

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

  _createClass(Graph, [{
    key: 'clear',
    value: function clear() {
      this._context.fillStyle = 'rgb(255, 255, 255)';
      this._context.fillRect(0, 0, this.screenWidth, this.screenHeight);

      return this;
    }
  }, {
    key: 'updateOffset',
    value: function updateOffset(scroll) {
      switch (scroll) {
        case OPCode.DIRECTION_NWEST:
          this.xOffset -= this.__scrollSpeed;
          this.yOffset -= this.__scrollSpeed;
          break;
        case OPCode.DIRECTION_NEAST:
          this.xOffset += this.__scrollSpeed;
          this.yOffset -= this.__scrollSpeed;
          break;
        case OPCode.DIRECTION_SWEST:
          this.xOffset -= this.__scrollSpeed;
          this.yOffset += this.__scrollSpeed;
          break;
        case OPCode.DIRECTION_SEAST:
          this.xOffset += this.__scrollSpeed;
          this.yOffset += this.__scrollSpeed;
          break;
        case OPCode.DIRECTION_WEST:
          this.xOffset -= this.__scrollSpeed;
          break;
        case OPCode.DIRECTION_EAST:
          this.xOffset += this.__scrollSpeed;
          break;
        case OPCode.DIRECTION_NORTH:
          this.yOffset -= this.__scrollSpeed;
          break;
        case OPCode.DIRECTION_SOUTH:
          this.yOffset += this.__scrollSpeed;
          break;
      }

      this.xOffset = Math.max(this.xOffset, 0);
      this.xOffset = Math.min(this.xOffset, (this._gameWidth - this._arenaSize) / 2);
      this.yOffset = Math.max(this.yOffset, 0);
      this.yOffset = Math.min(this.yOffset, (this._gameHeight - this._arenaSize) / 2);

      return this;
    }
  }, {
    key: 'drawDebug',
    value: function drawDebug() {
      if (this.player.id !== -1) {
        // COORDINATES
        var posX = this.player.position.x;
        var posY = this.player.position.y;
        var coordinates = 'Coordinates: ' + Math.round(posX) + ' ' + Math.round(posY);
        this.drawText(coordinates, 50, 50);

        // OFFSET
        var offset = 'Offset: ' + Math.round(this.xOffset) + ' ' + Math.round(this.yOffset);
        this.drawText(offset, 50, 70);

        // VELOCITY
        var velocity = 'Velocity: ' + Math.round(this.player.velocity.x) + ' ' + Math.round(this.player.velocity.y);
        this.drawText(velocity, 50, 30);
      }

      return this;
    }
  }, {
    key: 'drawArena',
    value: function drawArena() {
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
  }, {
    key: 'drawGrid',
    value: function drawGrid() {
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
  }, {
    key: 'drawText',
    value: function drawText(text, x, y, fontSize) {
      var hasStroke = arguments.length <= 4 || arguments[4] === undefined ? true : arguments[4];

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

      return this;
    }
  }, {
    key: 'drawPlayer',
    value: function drawPlayer(player) {
      var posX = player.position.x - this.xOffset;
      var posY = player.position.y - this.yOffset;

      var arcLength = 2 * (player.health / player.maxHealth) * Math.PI;
      var deficit = (2 * Math.PI - arcLength) / 2;
      var arcStart = player.rotation + deficit;
      var arcEnd = arcLength + player.rotation + deficit;

      this._context.beginPath();
      this._context.arc(posX, posY, player.radius, 0, 2 * Math.PI);
      this._context.fillStyle = getColorInRGB(player.color);
      this._context.fill();
      this._context.closePath();

      this._context.beginPath();
      this._context.arc(posX, posY, player.radius - 3, arcStart, arcEnd);
      this._context.lineWidth = 6;
      this._context.strokeStyle = getHealthColor(player.health, player.maxHealth);
      this._context.stroke();
      this._context.closePath();

      this._context.textAlign = 'center';
      this.drawText(player.name, posX, posY - 40, 14);
      this._context.textAlign = 'left';

      return this;
    }
  }, {
    key: 'drawPlayers',
    value: function drawPlayers() {
      var _this = this;

      var playerList = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var currentPlayer = playerList.find(function (player) {
        return player.id === _this.player.id;
      });
      if (currentPlayer) {
        this.player.position.x = currentPlayer.position.x;
        this.player.position.y = currentPlayer.position.y;
      }
      playerList.forEach(function (player) {
        return _this.drawPlayer(player);
      });

      return this;
    }
  }, {
    key: 'drawSpell',
    value: function drawSpell(spell) {
      var posX = spell.position.x - this.xOffset;
      var posY = spell.position.y - this.yOffset;

      this._context.beginPath();
      this._context.arc(posX, posY, spell.radius, 0, 2 * Math.PI);
      this._context.fillStyle = getColorInRGB(spell.color);
      this._context.fill();
      this._context.closePath();

      return this;
    }
  }, {
    key: 'drawSpells',
    value: function drawSpells() {
      var _this2 = this;

      var spellList = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      spellList.forEach(function (spell) {
        return _this2.drawSpell(spell);
      });

      return this;
    }
  }]);

  return Graph;
}();

exports.default = Graph;
;

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
  var hue = Math.floor(health / maxHealth * 120);

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
  return window.innerWidth && document.documentElement.clientWidth ? Math.min(window.innerWidth, document.documentElement.clientWidth) : window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
}

function getDefaultHeight() {
  return window.innerHeight && document.documentElement.clientHeight ? Math.min(window.innerHeight, document.documentElement.clientHeight) : window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
}

},{"../../opCode":17}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  MAC_ENTER: 3,
  BACKSPACE: 8,
  TAB: 9,
  NUM_CENTER: 12,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  PAUSE: 19,
  CAPS_LOCK: 20,
  ESC: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  PRINT_SCREEN: 44,
  INSERT: 45,
  DELETE: 46,
  ZERO: 48,
  ONE: 49,
  TWO: 50,
  THREE: 51,
  FOUR: 52,
  FIVE: 53,
  SIX: 54,
  SEVEN: 55,
  EIGHT: 56,
  NINE: 57,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  META: 91,
  CONTEXT_MENU: 93,
  NUM_ZERO: 96,
  NUM_ONE: 97,
  NUM_TWO: 98,
  NUM_THREE: 99,
  NUM_FOUR: 100,
  NUM_FIVE: 101,
  NUM_SIX: 102,
  NUM_SEVEN: 103,
  NUM_EIGHT: 104,
  NUM_NINE: 105,
  NUM_MULTIPLY: 106,
  NUM_PLUS: 107,
  NUM_MINUS: 109,
  NUM_PERIOD: 110,
  NUM_DIVISION: 111,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123
};

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./packets/index');

var Packets = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BufferCodec = require('buffercodec');
var OPCode = require('../../opCode');

var WSController = function () {
  function WSController() {
    _classCallCheck(this, WSController);

    this._uri = 'ws://192.168.2.116:3000';
    this._socket = null;
    this._eventHandlers = [];

    this._setupSocket();
  }

  _createClass(WSController, [{
    key: 'spawn',
    value: function spawn(playerName) {
      var buffer = BufferCodec().uint8(OPCode.SPAWN_PLAYER).uint8(playerName.length).string(playerName).result();

      this._socket.send(buffer);
    }
  }, {
    key: 'move',
    value: function move(player) {
      var buffer = BufferCodec().uint8(OPCode.PLAYER_MOVE).uint16le(player.target.x).uint16le(player.target.y).result();

      this._socket.send(buffer);
    }
  }, {
    key: 'cast',
    value: function cast(opcode, options) {
      var buffer = BufferCodec().uint8(opcode).uint16le(options.playerX).uint16le(options.playerY).uint16le(options.x).uint16le(options.y).result();

      this._socket.send(buffer);
    }
  }, {
    key: 'on',
    value: function on(name, listener) {
      if (!(name in this._eventHandlers) || !(this._eventHandlers[name] instanceof Array)) {
        this._eventHandlers[name] = [];
      }
      this._eventHandlers[name].push(listener);
    }
  }, {
    key: '_fire',
    value: function _fire(name, options) {
      if (name in this._eventHandlers && this._eventHandlers[name].length > 0) {
        this._eventHandlers[name].forEach(function (handler) {
          return handler(options);
        });
      }
    }
  }, {
    key: '_setupSocket',
    value: function _setupSocket() {
      this._socket = new WebSocket(this._uri);
      this._socket.binaryType = 'arraybuffer';

      this._socket.onopen = function (event) {
        this._fire('open');

        this._socket.onmessage = function handleMessage(message) {
          var codec = BufferCodec(message.data);
          var code = this._getOpCode(codec);

          switch (code) {
            case OPCode.ADD_PLAYER:
              this._fire('addPlayer', this._parse(codec, Packets.AddPlayer));
              break;
            case OPCode.UPDATE_PLAYERS:
              this._fire('updatePlayers', this._parse(codec, Packets.UpdatePlayers));
              break;
            case OPCode.UPDATE_SPELLS:
              this._fire('updateSpells', this._parse(codec, Packets.UpdateSpells));
              break;
            default:
              console.warn("Undefined opcode");
              break;
          }
        }.bind(this);
      }.bind(this);
    }
  }, {
    key: '_parse',
    value: function _parse(codec, packet) {
      return codec.parse(packet.mapping, packet.transform);
    }
  }, {
    key: '_getOpCode',
    value: function _getOpCode(codec) {
      return codec.parse({ code: 'uint8' }, function (obj) {
        return obj.code;
      });
    }
  }]);

  return WSController;
}();

exports.default = WSController;

},{"../../opCode":17,"./packets/index":12,"buffercodec":1}],6:[function(require,module,exports){
'use strict';

var _KeyCode = require('./KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _Graph = require('./Graph');

var _Graph2 = _interopRequireDefault(_Graph);

var _WSController = require('./WSController');

var _WSController2 = _interopRequireDefault(_WSController);

var _DomElement = require('./DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

var _SmartMap = require('./util/SmartMap');

var _SmartMap2 = _interopRequireDefault(_SmartMap);

var _spells = require('./spells');

var Spells = _interopRequireWildcard(_spells);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('./polyfills');

var Models = require('./models');
var OPCode = require('../../opCode');

(function () {

  var graph;
  var ws;
  var animLoopHandle;
  var lastUpdate;
  var moveTick = performance.now();
  var targetTick = performance.now();
  var mouse = { x: 0, y: 0 };
  var scrollDirection = null;

  var _playerList = new _SmartMap2.default();
  var playerList = [];
  var spellList = [];
  var currentPlayer = null;

  var canvas = new _DomElement2.default('.js-canvas', _Graph2.default);
  graph = canvas.instance;

  var playerNameElement = new _DomElement2.default('.js-player-name');
  var playButtonElement = new _DomElement2.default('.js-play-button');
  var errorElement = new _DomElement2.default('.js-error');

  playButtonElement.on('mouseup', startGame);
  playerNameElement.on('keyup', function validate(event) {
    if (! ~[_KeyCode2.default.ENTER, _KeyCode2.default.MAC_ENTER].indexOf(event.keyCode)) {
      startGame();
    } else {
      var pattern = /^[a-zA-Z0-9 ]{0,25}$/;
      if (event.target.value.match(pattern)) {
        errorElement.htmlElement.style.display = 'none';
        playButtonElement.htmlElement.disabled = false;
      } else {
        errorElement.htmlElement.style.display = 'block';
        playButtonElement.htmlElement.disabled = true;
      }
    }
  });

  function animationLoop(timestamp) {
    animLoopHandle = window.requestAnimationFrame(animationLoop);

    gameLoop(timestamp - lastUpdate);
    lastUpdate = timestamp;
  }

  function gameLoop(deltaT) {
    graph.clear().updateOffset(scrollDirection).drawGrid().drawArena().drawSpells(spellList).drawPlayers(playerList).drawDebug();

    playerList.forEach(function (player) {
      return player.calculateNextPosition(deltaT);
    });
    spellList.forEach(function (spell) {
      return spell.calculateNextPosition(deltaT);
    });

    spellList.forEach(function (spell, spellIndex) {
      playerList.forEach(function (player) {
        if (spell.ownerId !== player.ownerId) {
          var distanceX = player.position.x - spell.position.x;
          var distanceY = player.position.y - spell.position.y;
          var distance = distanceX * distanceX + distanceY * distanceY;
          if (distance < Math.pow(spell.radius + player.radius, 2)) {
            spell.onCollision(player);
            spellList.splice(spellIndex, 1);
          }
        }
      });
    });
  }

  function startGame() {
    var playerName = playerNameElement.htmlElement.value;
    new _DomElement2.default('.js-start-menu').htmlElement.style.display = 'none';

    ws = new _WSController2.default();

    ws.on('open', function startGame() {

      ws.spawn(playerName);

      canvas.on('contextmenu', function (event) {
        return event.preventDefault();
      });

      canvas.on('mousemove', function (event) {
        var westBreakpoint = graph.screenWidth / 10,
            eastBreakpoint = graph.screenWidth * 9 / 10,
            northBreakpoint = graph.screenHeight / 10,
            southBreakpoint = graph.screenHeight * 9 / 10;

        if (event.x < westBreakpoint && event.y < northBreakpoint) {
          scrollDirection = OPCode.DIRECTION_NWEST;
        } else if (event.x > eastBreakpoint && event.y < northBreakpoint) {
          scrollDirection = OPCode.DIRECTION_NEAST;
        } else if (event.x < westBreakpoint && event.y > southBreakpoint) {
          scrollDirection = OPCode.DIRECTION_SWEST;
        } else if (event.x > eastBreakpoint && event.y > southBreakpoint) {
          scrollDirection = OPCode.DIRECTION_SEAST;
        } else if (event.x < westBreakpoint) {
          scrollDirection = OPCode.DIRECTION_WEST;
        } else if (event.x > eastBreakpoint) {
          scrollDirection = OPCode.DIRECTION_EAST;
        } else if (event.y < northBreakpoint) {
          scrollDirection = OPCode.DIRECTION_NORTH;
        } else if (event.y > southBreakpoint) {
          scrollDirection = OPCode.DIRECTION_SOUTH;
        } else {
          scrollDirection = null;
        }
        mouse.x = event.x;
        mouse.y = event.y;
      });

      canvas.on('mousedown', function (event) {
        if (currentPlayer && event.button === 2) {
          event.preventDefault();
          event.stopPropagation();
          var now = performance.now();
          var diff = now - targetTick;
          if (diff > 100) {
            var targetX = mouse.x + graph.xOffset;
            var targetY = mouse.y + graph.yOffset;
            targetX = Math.min(Math.max(targetX, 0), graph._gameWidth);
            targetY = Math.min(Math.max(targetY, 0), graph._gameHeight);
            currentPlayer.setTarget(targetX, targetY);
            targetTick = now;
            ws.move(currentPlayer);
          }
        }
      });

      window.document.addEventListener('keydown', function (event) {
        switch (event.keyCode) {
          case _KeyCode2.default.Q:
            ws.cast(OPCode.CAST_PRIMARY, {
              playerX: currentPlayer.position.x,
              playerY: currentPlayer.position.y,
              x: mouse.x + graph.xOffset,
              y: mouse.y + graph.yOffset
            });
            break;
        }
      });

      ws.on('addPlayer', function (node) {
        currentPlayer = new Models.Player(node);
        graph.player = currentPlayer;
        playerList.push(currentPlayer);
      });

      ws.on('updatePlayers', function (players) {
        var updatedPlayers = players.updatedPlayers;
        if (updatedPlayers && updatedPlayers.length > 0) {
          updatedPlayers.forEach(function (updatedPlayer) {
            var found = playerList.filter(function (player) {
              return player.id === updatedPlayer.id;
            });
            if (found.length === 0) {
              var player = new Models.Player(updatedPlayer);
              playerList.splice(0, 0, player);
            } else {
              found[0].setTarget(updatedPlayer.target);
            }
          });
        }

        var destroyedPlayers = players.destroyedPlayers;
        if (destroyedPlayers && destroyedPlayers.length > 0) {
          destroyedPlayers.forEach(function (destroyedPlayer) {
            var index = -1;
            for (var i = 0; i < playerList.length; i++) {
              if (playerList[i].id === destroyedPlayer) {
                index = i;
              }
            }
            if (index !== -1) {
              playerList.splice(index, 1);
            }
          });
        }
      });

      ws.on('updateSpells', function (spells) {
        var updatedSpells = spells.updatedSpells;
        if (updatedSpells && updatedSpells.length > 0) {
          updatedSpells.forEach(function (updatedSpell) {
            var SpellClass = Spells.get(updatedSpell.type);
            var spell = new SpellClass(updatedSpell);
            spell.onAdd(playerList.find(function (p) {
              return p.ownerId === spell.ownerId;
            }));
            spellList.splice(0, 0, spell);
          });
        }

        var destroyedSpells = spells.destroyedSpells;
        if (destroyedSpells && destroyedSpells.length > 0) {
          destroyedSpells.forEach(function (destroyedSpell) {
            var index = -1;
            for (var i = 0; i < spellList.length; i++) {
              if (spellList[i].id === destroyedSpell) {
                index = i;
              }
            }
            if (index !== -1) {
              spellList.splice(index, 1);
            }
          });
        }
      });
    });

    if (!animLoopHandle) {
      lastUpdate = Date.now();
      animationLoop(lastUpdate);
    }
  }
})();

},{"../../opCode":17,"./DomElement":2,"./Graph":3,"./KeyCode":4,"./WSController":5,"./models":8,"./polyfills":13,"./spells":15,"./util/SmartMap":16}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
  function Player(playerModel) {
    _classCallCheck(this, Player);

    playerModel = playerModel || {};

    this.id = playerModel.id || -1;
    this.ownerId = playerModel.ownerId || -1;
    this.name = playerModel.name;
    this.health = playerModel.health;
    this.maxHealth = playerModel.maxHealth;
    this.speed = 3;
    this.acceleration = 0.1;
    this.rotation = 0;
    this.targetRotation = 0;
    this.radius = 20;
    this.mass = 20;
    this.velocity = { x: 0, y: 0 };
    this.stunned = 0;
    this._baseFriction = 0.2;
    this._baseRotationTicks = 10;
    this._baseCastTicks = 10;
    this._baseRadius = this.radius;
    this.__maxRadius = 25;
    this.__rotationTicks = this._baseRotationTicks;
    this.__castTicks = this._baseCastTicks;
    this.__friction = this._baseFriction;
    this.__animateCast = false;

    this.color = {
      r: playerModel.color.r || 0,
      g: playerModel.color.g | 0,
      b: playerModel.color.b || 0
    };

    this.position = {
      x: playerModel.position.x || 0,
      y: playerModel.position.y || 0
    };

    this.target = {
      x: (playerModel.target ? playerModel.target.x : null) || playerModel.position.x || 0,
      y: (playerModel.target ? playerModel.target.y : null) || playerModel.position.y || 0
    };
  }

  _createClass(Player, [{
    key: 'calculateNextPosition',
    value: function calculateNextPosition(deltaT) {
      if (typeof this.target.x !== 'undefined' && typeof this.target.y !== 'undefined') {
        this._calculatePosition(deltaT);
      }
      if (typeof this.targetRotation !== 'undefined') {
        this._calculateRotation(deltaT);
      }
      if (this.__animateCast) {
        this._updateAnimation();
      }
    }
  }, {
    key: 'setTarget',
    value: function setTarget(target) {
      this.target = {
        x: target.x,
        y: target.y
      };

      this.targetRotation = Math.atan2(target.y - this.position.y, target.x - this.position.x);
      var diff = Math.abs(this.targetRotation - this.rotation);

      if (diff > Math.PI / 2) {
        this.__friction = this._baseFriction;
      }
    }
  }, {
    key: 'onCast',
    value: function onCast(spell) {
      this.__animateCast = true;
      this.targetRotation = Math.atan2(spell.target.y - this.position.y, spell.target.x - this.position.x);
    }
  }, {
    key: '_calculatePosition',
    value: function _calculatePosition(deltaT) {
      if (!this._arePositionsApproximatelyEqual(this.position, this.target) || this.stunned) {
        if (this.__friction < 1) {
          this.__friction += this.acceleration;
        }

        var speed = this.speed * this.__friction;
        var velX = this.velocity.x;
        var velY = this.velocity.y;
        var velocity = 0,
            fn;

        if (!this.stunned) {
          var vX = this.target.x - this.position.x;
          var vY = this.target.y - this.position.y;
          var distance = this._getHypotenuseLength(vX, vY);

          velX = vX / distance * speed;
          velY = vY / distance * speed;
        }

        if (Math.abs(this.velocity.x - velX) > this.acceleration) {
          velocity = this.acceleration * Math.sign(velX);
          fn = Math.sign(velX) !== 1 ? Math.max : Math.min;
          this.velocity.x = fn(this.velocity.x + velocity, Math.sign(velX) * speed);
        } else {
          this.velocity.x = velX;
        }

        if (Math.abs(this.velocity.y - velY) > this.acceleration) {
          velocity = this.acceleration * Math.sign(velY);
          fn = Math.sign(velY) !== 1 ? Math.max : Math.min;
          this.velocity.y = fn(this.velocity.y + velocity, Math.sign(velY) * speed);
        } else {
          this.velocity.y = velY;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.stunned) {
          this.velocity.x *= 1 - this.acceleration;
          this.velocity.y *= 1 - this.acceleration;
          this.target.x = this.position.x;
          this.target.y = this.position.y;
          this.stunned--;
        }
      } else {
        this.__friction = this._baseFriction;
        this.velocity = { x: 0, y: 0 };
      }
    }
  }, {
    key: '_calculateRotation',
    value: function _calculateRotation(deltaT) {
      if (Math.abs(this.rotation - this.targetRotation) > 1e-5) {
        if (this.__rotationTicks > 0) {
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
              this.rotation += diff / this.__rotationTicks;
            } else {
              this.rotation -= diff / this.__rotationTicks;
            }
          } else {
            this.rotation += (this.targetRotation - this.rotation) / this.__rotationTicks;
          }
        } else {
          this.rotation = this.targetRotation;
          this.__rotationTicks = this._baseRotationTicks;
        }
      }
    }
  }, {
    key: '_updateAnimation',
    value: function _updateAnimation() {
      if (this.__castTicks > 0) {
        var sign = Math.sign(this.__castTicks - this._baseCastTicks / 2);
        this.radius += sign * (this.__maxRadius - this.radius) / 4;
        this.__castTicks--;
      } else {
        this.radius = this._baseRadius;
        this.__castTicks = this._baseCastTicks;
        this.__animateCast = false;
        this.targetRotation = Math.atan2(this.target.y - this.position.y, this.target.x - this.position.x);
      }
    }
  }, {
    key: '_getHypotenuseLength',
    value: function _getHypotenuseLength(x, y) {
      return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
  }, {
    key: '_arePositionsApproximatelyEqual',
    value: function _arePositionsApproximatelyEqual(positionA, positionB) {
      var errorMargin = 5;
      return Math.abs(positionA.x - positionB.x) < errorMargin && Math.abs(positionA.y - positionB.y) < errorMargin;
    }
  }]);

  return Player;
}();

exports.default = Player;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Player = require('./Player');

Object.defineProperty(exports, 'Player', {
  enumerable: true,
  get: function get() {
    return _Player.default;
  }
});

},{"./Player":7}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  mapping: {
    id: { type: 'string', length: 32 },
    ownerId: { type: 'string', length: 32 },
    name: 'string',
    health: 'uint16le',
    maxHealth: 'uint16le',
    x: 'float32le',
    y: 'float32le',
    r: 'uint8',
    g: 'uint8',
    b: 'uint8'
  },
  transform: function transform(player) {
    return {
      id: player.id,
      ownerId: player.ownerId,
      name: player.name,
      health: player.health,
      maxHealth: player.maxHealth,
      position: { x: player.x, y: player.y },
      color: { r: player.r, g: player.g, b: player.b }
    };
  }
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  mapping: {
    updatedPlayers: [{
      id: { type: 'string', length: 32 },
      ownerId: { type: 'string', length: 32 },
      name: 'string',
      health: 'unint16le',
      maxHealth: 'uint16le',
      x: 'float32le',
      y: 'float32le',
      targetX: 'float32le',
      targetY: 'float32le',
      r: 'uint8',
      g: 'uint8',
      b: 'uint8'
    }],
    destroyedPlayers: [{
      id: { type: 'string', length: 32 }
    }]
  },
  transform: function transform(object) {
    var updatedPlayers = object.updatedPlayers.map(function (player) {
      return {
        id: player.id,
        ownerId: player.ownerId,
        name: player.health,
        maxHealth: player.maxHealth,
        position: { x: player.x, y: player.y },
        target: { x: player.targetX, y: player.targetY },
        color: { r: player.r, g: player.g, b: player.b }
      };
    });
    var destroyedPlayers = object.destroyedPlayers.map(function (player) {
      return player.id;
    });

    return {
      updatedPlayers: updatedPlayers,
      destroyedPlayers: destroyedPlayers
    };
  }
};

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  mapping: {
    updatedSpells: [{
      id: { type: 'string', length: 32 },
      ownerId: { type: 'string', length: 32 },
      type: 'uint8',
      mass: 'uint8',
      power: 'uint8',
      x: 'float32le',
      y: 'float32le',
      targetX: 'float32le',
      targetY: 'float32le',
      r: 'uint8',
      g: 'uint8',
      b: 'uint8'
    }],
    destroyedSpells: [{
      id: { type: 'string', length: 32 }
    }]
  },
  transform: function transform(object) {
    var updatedSpells = object.updatedSpells.map(function (spell) {
      return {
        id: spell.id,
        ownerId: spell.ownerId,
        type: spell.type,
        mass: spell.mass,
        power: spell.power,
        position: { x: spell.x, y: spell.y },
        target: { x: spell.targetX, y: spell.targetY },
        color: { r: spell.r, g: spell.g, b: spell.b }
      };
    });
    var destroyedSpells = object.destroyedSpells.map(function (spell) {
      return spell.id;
    });

    return {
      updatedSpells: updatedSpells,
      destroyedSpells: destroyedSpells
    };
  }
};

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AddPlayer = require('./AddPlayer');

Object.defineProperty(exports, 'AddPlayer', {
  enumerable: true,
  get: function get() {
    return _AddPlayer.default;
  }
});

var _UpdatePlayers = require('./UpdatePlayers');

Object.defineProperty(exports, 'UpdatePlayers', {
  enumerable: true,
  get: function get() {
    return _UpdatePlayers.default;
  }
});

var _UpdateSpells = require('./UpdateSpells');

Object.defineProperty(exports, 'UpdateSpells', {
  enumerable: true,
  get: function get() {
    return _UpdateSpells.default;
  }
});

},{"./AddPlayer":9,"./UpdatePlayers":10,"./UpdateSpells":11}],13:[function(require,module,exports){
'use strict';

if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
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

(function () {
  'use strict';

  var vendors = ['webkit', 'moz'];
  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
  }
  if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
   || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function (callback) {
      var now = Date.now();
      var nextTime = Math.max(lastTime + 16, now);
      return setTimeout(function () {
        callback(lastTime = nextTime);
      }, nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
  }
})();

},{}],14:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Primary = function () {
  function Primary(spellModel) {
    _classCallCheck(this, Primary);

    this.id = spellModel.id;
    this.ownerId = spellModel.ownerId;
    this.type = spellModel.type;
    this.mass = spellModel.mass;
    this.power = spellModel.power;
    this.velocity = { x: 0, y: 0 };
    this.speed = 5;
    this.radius = 10;

    this.color = spellModel.color || { r: 0, g: 0, b: 0 };
    this.position = spellModel.position || { x: 0, y: 0 };

    this.setTarget(spellModel.target);
  }

  _createClass(Primary, [{
    key: 'calculateNextPosition',
    value: function calculateNextPosition() {
      if (typeof this.velocity.x !== 'undefined' && typeof this.velocity.y !== 'undefined') {
        this._calculatePosition.call(this);
      }
    }
  }, {
    key: 'onAdd',
    value: function onAdd(owner) {
      owner.onCast(this);
    }
  }, {
    key: 'onCollision',
    value: function onCollision(model) {
      model.health -= this.power;

      model.velocity.x += this.power * this.mass * this.velocity.x / model.mass;
      model.velocity.y += this.power * this.mass * this.velocity.y / model.mass;

      model.stunned = 50;
    }
  }, {
    key: 'setTarget',
    value: function setTarget(target) {
      this.target = {
        x: target.x,
        y: target.y
      };

      var vX = this.target.x - this.position.x;
      var vY = this.target.y - this.position.y;
      var distance = this._getHypotenuseLength(vX, vY);

      this.velocity = {
        x: vX / distance,
        y: vY / distance
      };
    }
  }, {
    key: '_calculatePosition',
    value: function _calculatePosition() {
      this.position = {
        x: this.position.x + this.velocity.x * this.speed,
        y: this.position.y + this.velocity.y * this.speed
      };
    }
  }, {
    key: '_getHypotenuseLength',
    value: function _getHypotenuseLength(x, y) {
      return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
  }]);

  return Primary;
}();

exports.default = Primary;

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Primary = require('./Primary');

Object.defineProperty(exports, 'Primary', {
  enumerable: true,
  get: function get() {
    return _Primary.default;
  }
});
exports.get = get;
var OPCode = require('../../../opCode');

function get(code) {
  var spell = null;

  switch (code) {
    case OPCode.SPELL_PRIMARY:
      spell = module.exports.Primary;
      break;
  }

  return spell;
}

},{"../../../opCode":17,"./Primary":14}],16:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SmartMap = function () {
  function SmartMap() {
    _classCallCheck(this, SmartMap);

    this._head = null;
    this._tail = null;
    this._position = null;
    this._keys = {};
    this.length = 0;
  }

  _createClass(SmartMap, [{
    key: "set",
    value: function set(key, value) {
      if (!this._keys[key]) {
        var node = { v: value };

        if (this.length === 0) {
          this._head = this._tail = node;
          this.rwd();
        } else {
          node.p = this._tail;
          this._tail.n = node;
          this._tail = node;
        }

        this._keys[key] = node;

        this.len++;
      }
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      var v;
      var node = this._keys[key];

      if (node) {
        v = node.v;

        if (node.p) node.p.n = node.n;
        if (node.n) node.n.p = node.p;

        this._keys[key] = null;
        this.len--;
      }

      return v;
    }
  }, {
    key: "get",
    value: function get(key) {
      return this._keys[key];
    }
  }, {
    key: "itr",
    value: function itr() {
      return this._position = this._position.n;
    }
  }, {
    key: "rwd",
    value: function rwd() {
      this._position = { n: this._head };
    }
  }, {
    key: "empty",
    value: function empty() {
      this._keys = {};
      this._head = this._tail = this._position = null;
      this.length = 0;
    }
  }]);

  return SmartMap;
}();

exports.default = SmartMap;

},{}],17:[function(require,module,exports){
"use strict";

module.exports = {
  // actions
  "PING": 0x01,
  "PONG": 0x02,
  "SPAWN_PLAYER": 0x03,
  "ADD_PLAYER": 0x04,
  "UPDATE_PLAYERS": 0x05,
  "UPDATE_SPELLS": 0x06,
  "PLAYER_MOVE": 0x07,

  // cast
  "CAST_PRIMARY": 0x08,

  // types
  "SPELL_PRIMARY": 0x0A,

  // direction
  "DIRECTION_WEST": 0X14,
  "DIRECTION_EAST": 0X15,
  "DIRECTION_NORTH": 0X16,
  "DIRECTION_SOUTH": 0X17,
  "DIRECTION_NWEST": 0X18,
  "DIRECTION_NEAST": 0X19,
  "DIRECTION_SWEST": 0X1A,
  "DIRECTION_SEAST": 0X1B
};

},{}]},{},[6])


//# sourceMappingURL=game.js.map
