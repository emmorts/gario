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
};

BufferCodec.prototype.getBuffer = function (trimOffset) {
  if (trimOffset) {
    return this.buffer.slice(this.offset);
  }
  return this.buffer;
};

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
        element.length = data.getUint8(this.offset++);
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

BufferCodec.Schema = function (schema, transform) {
  this.schema = schema;
  this.transform = transform;
}

BufferCodec.Schema.prototype.encode = function (object, codec) {
  var codec = codec || new BufferCodec();

  function encode(value, schema) {
    for (var propertyName in schema) {
      var method = null;
      var encoding = null;
      if (schema[propertyName] instanceof Array) {
        codec.uint8(object[propertyName].length);
        object[propertyName].forEach(function (item) {
          encode(item, schema[propertyName][0]);
        });
      } else if (schema[propertyName] instanceof Object) {
        method = schema[propertyName].type;
        if (method === 'string') {
          encoding = schema[propertyName].encoding;
          codec.uint8(schema[propertyName].length || object[propertyName].length);
        }
      } else {
        method = schema[propertyName];
        if (method === 'string') {
          codec.uint8(value[propertyName].length);
        }
      }
      if (method) {
        codec[method](value[propertyName], encoding);
      }
    }
  }

  encode(object, this.schema);

  return codec.result();
}

BufferCodec.Schema.prototype.decode = function (buffer) {
  var codec = new BufferCodec(buffer);
  return codec.parse(this.schema, this.transform);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BufferCodec;
} else {
  window.BufferCodec = BufferCodec;
}
},{}],2:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Immutable = factory());
})(this, function () {
  var SmartMap = function () {
    if (arguments.length === 0) {
      _warn("Unable to initialize SmartMap, no indices provided.");
      return;
    }
    this.indices = Array.prototype.slice.call(arguments);
    this.length = 0;
    this._head = {};
    this._tail = {};
    this._position = {};
    this._keys = {};
    this._debug = true;
  }
  
  SmartMap.prototype.add = function (object) {
    if (this.indices.length > 0) {
      var node = { v: Object.seal(object) };
      
      this.indices.forEach(function (index) {
        if (!(index in this._keys)) {
          this._keys[index] = {};
        }
        
        if (index in object) {
          var key = object[index];
          
          if (this.length === 0) {
            this._head[index] = this._tail[index] = node;
            node.p = node.n = undefined;
            this.reset();
          } else {
            node.p = this._tail[index];
            node.n = undefined;
            this._tail[index].n = node;
            this._tail[index] = node;
          }
          
          this._keys[index][key] = node;
          
        } else {
          _warn("Index `" + index + "` doesn't exist in given object.");
        }
      }.bind(this));
      
      this.length++;
    }
  }
  
  SmartMap.prototype.get = function (key, index) {
    if (index in this._keys) {
      if (key in this._keys[index]) {
        return this._keys[index][key].v;
      } else {
        _warn("Undefined key `" + key + "` in index `" + index + "`.");
      }
    } else {
      _warn("Undefined index `" + index + "`.");
    }
    
    return undefined;
  }
  
  SmartMap.prototype.delete = function (key, index) {
    if (index in this._keys && key in this._keys[index]) {
      var object;
      var node = this._keys[index][key];

      if (node) {
        object = node.v;

        if (node.p) node.p.n = node.n;
        if (node.n) node.n.p = node.p;
        if (node === this._tail[index]) this._tail[index] = this._tail[index].p; 

        this._keys[index][key] = undefined;
        this.length--;
        
        delete this._keys[index][key];
      }

      return object;
    }
    
    return undefined;
  }
  
  SmartMap.prototype.reset = function () {
    this._position = this.indices.reduce(function (pos, index) {
      if (index in this._head) {
        pos[index] = { n: this._head[index] };
      } else {
        pos[index] = { n : undefined };
      }
      return pos;
    }.bind(this), {});
  }
  
  SmartMap.prototype.empty = function () {
    this._keys = {};
    this._head = this._tail = {};
    this.length = 0;
    this.reset();
  };
  
  SmartMap.prototype.forEach = function (fn, thisArg) {
    var tmp, index = 0;
    
    if (this.length) {
      var iterateBy = this.indices[0];
      while (tmp = _next.call(this, iterateBy)) {
        if (thisArg) {
          fn.call(thisArg, tmp.v, index);
        } else {
          fn(tmp.v, index);
        }
        index++;
      }
      
      this.reset();
    }
  }
  
  SmartMap.prototype.find = function (predicate, thisArg) {
    var tmp, result;
    
    if (this.length) {
      var iterateBy = this.indices[0];
      while (tmp = _next.call(this, iterateBy)) {
        var passes = thisArg ? predicate.call(this, tmp.v) : predicate(tmp.v);
        if (passes) {
          result = tmp.v;
          this.reset();
          break;
        }
      }
    }
    
    return result;
  }
  
  return SmartMap;
  
  function _validateObject(object) {
    var validatedProperties = 0;
    for (var property in object) {
      if (~this.indices.indexOf(property)) validatedProperties++;
    }
    return validatedProperties === this.indices.length;
  }
  
  function _next(index) {
    return this._position[index] = this._position[index].n;
  }
  
  function _warn(message) {
    if (this._debug) {
      console.warn(message);
    }
  }
});
},{}],3:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BufferCodec = require('buffercodec');
var BufferSchema = BufferCodec.Schema;

var Schema = function (_BufferSchema) {
  _inherits(Schema, _BufferSchema);

  function Schema(opCode, schema, transform) {
    _classCallCheck(this, Schema);

    if (!opCode) throw new Error("Operation code must be provided");

    var _this = _possibleConstructorReturn(this, (Schema.__proto__ || Object.getPrototypeOf(Schema)).call(this, schema, transform));

    _this.opCode = opCode;
    return _this;
  }

  _createClass(Schema, [{
    key: "encode",
    value: function encode(object) {
      var codec = BufferCodec().uint8(this.opCode);

      return _get(Schema.prototype.__proto__ || Object.getPrototypeOf(Schema.prototype), "encode", this).call(this, object, codec);
    }
  }, {
    key: "decode",
    value: function decode(buffer) {
      return _get(Schema.prototype.__proto__ || Object.getPrototypeOf(Schema.prototype), "decode", this).call(this, buffer);
    }
  }]);

  return Schema;
}(BufferSchema);

module.exports = Schema;

},{"buffercodec":1}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _smartmap = require('smartmap');

var _smartmap2 = _interopRequireDefault(_smartmap);

var _WSController = require('client/WSController');

var _WSController2 = _interopRequireDefault(_WSController);

var _EventEmitter2 = require('client/util/EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

var _spells = require('client/spells');

var Spells = _interopRequireWildcard(_spells);

var _models = require('client/models');

var Models = _interopRequireWildcard(_models);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OPCode = require('opCode');

var instance = null;

var Game = function (_EventEmitter) {
  _inherits(Game, _EventEmitter);

  function Game() {
    _classCallCheck(this, Game);

    var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this));

    _this.started = false;
    _this.currentPlayer = null;
    _this.controller = null;
    _this.playerList = new _smartmap2.default('id', 'ownerId');
    _this.spellList = new _smartmap2.default('id');
    return _this;
  }

  _createClass(Game, [{
    key: 'startGame',
    value: function startGame(playerName, onConnection) {
      this.controller = new _WSController2.default();

      this.controller.on('open', function startGame() {

        this.controller.on('addPlayer', this._handleAddPlayer.bind(this));
        this.controller.on('updatePlayers', this._handleUpdatePlayers.bind(this));
        this.controller.on('updateSpells', this._handleUpdateSpells.bind(this));

        this.controller.send(OPCode.SPAWN_PLAYER, { name: playerName });

        this.onStart(onConnection);
      }.bind(this));
    }
  }, {
    key: 'update',
    value: function update(deltaT) {
      var _this2 = this;

      this.playerList.forEach(function (player) {
        return player.calculateNextPosition(deltaT);
      });
      this.spellList.forEach(function (spell) {
        return spell.calculateNextPosition(deltaT);
      });

      this.spellList.forEach(function (spell, spellIndex) {
        _this2.playerList.forEach(function (player) {
          if (spell.ownerId !== player.ownerId) {
            var distanceX = player.position.x - spell.position.x;
            var distanceY = player.position.y - spell.position.y;
            var distance = distanceX * distanceX + distanceY * distanceY;
            if (distance < Math.pow(spell.radius + player.radius, 2)) {
              spell.onCollision(player);
              _this2.spellList.delete(spell.id, 'id');
            }
          }
        });
      });
    }
  }, {
    key: 'onStart',
    value: function onStart(callback) {
      this.started = true;

      if (callback) {
        callback();
      }
    }
  }, {
    key: '_handleAddPlayer',
    value: function _handleAddPlayer(player) {
      this.currentPlayer = new Models.Player(player);
      this._fire('addPlayer');
      this.playerList.add(this.currentPlayer);
    }
  }, {
    key: '_handleUpdatePlayers',
    value: function _handleUpdatePlayers(players) {
      var _this3 = this;

      var updatedPlayers = players.updatedPlayers;
      if (updatedPlayers && updatedPlayers.length > 0) {
        updatedPlayers.forEach(function (updatedPlayer) {
          var foundPlayer = _this3.playerList.get(updatedPlayer.id, 'id');
          if (foundPlayer) {
            foundPlayer.setTarget(updatedPlayer.target);
          } else {
            var player = new Models.Player(updatedPlayer);
            _this3.playerList.add(player);
          }
        }, this);
      }

      var destroyedPlayers = players.destroyedPlayers;
      if (destroyedPlayers && destroyedPlayers.length > 0) {
        destroyedPlayers.forEach(function (destroyedPlayer) {
          return _this3.playerList.delete(destroyedPlayer, 'id');
        }, this);
      }
    }
  }, {
    key: '_handleUpdateSpells',
    value: function _handleUpdateSpells(spells) {
      var _this4 = this;

      var updatedSpells = spells.updatedSpells;
      if (updatedSpells && updatedSpells.length > 0) {
        updatedSpells.forEach(function (updatedSpell) {
          var SpellClass = Spells.get(updatedSpell.type);
          var spell = new SpellClass(updatedSpell);
          spell.onAdd(_this4.playerList.get(spell.ownerId, 'ownerId'));
          _this4.spellList.add(spell);
        }, this);
      }

      var destroyedSpells = spells.destroyedSpells;
      if (destroyedSpells && destroyedSpells.length > 0) {
        destroyedSpells.forEach(function (destroyedSpell) {
          return _this4.spellList.delete(destroyedSpell, 'id');
        }, this);
      }
    }
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      if (instance) {
        return instance;
      } else {
        return instance = new Game();
      }
    }
  }]);

  return Game;
}(_EventEmitter3.default);

exports.default = Game;

},{"client/WSController":6,"client/models":17,"client/spells":19,"client/util/EventEmitter":23,"opCode":26,"smartmap":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _statistics = require('client/statistics');

var Statistics = _interopRequireWildcard(_statistics);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OPCode = require('opCode');

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

        // Score
        var score = 'Score: ' + Statistics.Score.getInstance().currentScore();
        this.drawText(score, 50, 10);
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
      var hasStroke = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

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
    value: function drawPlayers(playerList) {
      var _this = this;

      var currentPlayer = playerList.get(this.player.id, 'id');
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

      var spellList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

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

},{"client/statistics":21,"opCode":26}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BufferCodec = require('buffercodec');
var EventEmitter = require('client/util/EventEmitter');
var Action = require('client/actions');
var OPCode = require('opCode');
var Schema = require('schemas');

var WSController = function (_EventEmitter) {
  _inherits(WSController, _EventEmitter);

  function WSController() {
    _classCallCheck(this, WSController);

    var _this = _possibleConstructorReturn(this, (WSController.__proto__ || Object.getPrototypeOf(WSController)).call(this));

    _this._uri = 'ws://127.0.0.1:3000';
    _this._socket = null;

    _this._setupSocket();
    return _this;
  }

  _createClass(WSController, [{
    key: 'send',
    value: function send(opCode, object) {
      if (opCode in Action) {
        var action = new Action[opCode]();
        var buffer = action.build(object);

        if (buffer) {
          this._socket.send(buffer);
        }
      } else {
        console.error('Operation \'' + OPCode.getName(opCode) + '\' does not cover any action.\'');
      }
    }
  }, {
    key: '_setupSocket',
    value: function _setupSocket() {
      this._socket = new WebSocket(this._uri);
      this._socket.binaryType = 'arraybuffer';

      this._socket.onopen = function onConnectionEstablished(event) {
        this._fire('open');

        this._socket.onmessage = function handleMessage(message) {
          var codec = BufferCodec(message.data);
          var code = this._getOpCode(codec);

          if (code in Action) {
            var ActionClass = Action[code];
            var action = new ActionClass();
            var buffer = codec.getBuffer(true);

            if (ActionClass.eventName) {
              this._fire(ActionClass.eventName, action.parse(buffer));
            }
          } else {
            console.error('Operation \'' + OPCode.getName(code) + '\' does not cover any action.\'');
          }
        }.bind(this);
      }.bind(this);
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
}(EventEmitter);

exports.default = WSController;

},{"buffercodec":1,"client/actions":14,"client/util/EventEmitter":23,"opCode":26,"schemas":33}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Schema = require('schemas');

var Action = function () {
  function Action(opCode) {
    _classCallCheck(this, Action);

    this.actionSchema = Schema.get(opCode);
  }

  _createClass(Action, [{
    key: 'parse',
    value: function parse(buffer) {
      if (this.actionSchema) {
        return this.actionSchema.decode(buffer);
      }

      return null;
    }
  }, {
    key: 'build',
    value: function build(object) {
      if (this.actionSchema) {
        return this.actionSchema.encode(object);
      }

      return null;
    }
  }]);

  return Action;
}();

;

module.exports = Action;

},{"schemas":33}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Action = require('client/actions/Action');
var OPCode = require('opCode');

var AddPlayer = function (_Action) {
  _inherits(AddPlayer, _Action);

  function AddPlayer() {
    _classCallCheck(this, AddPlayer);

    return _possibleConstructorReturn(this, (AddPlayer.__proto__ || Object.getPrototypeOf(AddPlayer)).call(this, OPCode.ADD_PLAYER));
  }

  _createClass(AddPlayer, null, [{
    key: 'eventName',
    get: function get() {
      return 'addPlayer';
    }
  }]);

  return AddPlayer;
}(Action);

module.exports = AddPlayer;

},{"client/actions/Action":7,"opCode":26}],9:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Action = require('client/actions/Action');
var OPCode = require('opCode');

var CastSpell = function (_Action) {
  _inherits(CastSpell, _Action);

  function CastSpell() {
    _classCallCheck(this, CastSpell);

    return _possibleConstructorReturn(this, (CastSpell.__proto__ || Object.getPrototypeOf(CastSpell)).call(this, OPCode.CAST_SPELL));
  }

  return CastSpell;
}(Action);

module.exports = CastSpell;

},{"client/actions/Action":7,"opCode":26}],10:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Action = require('client/actions/Action');
var OPCode = require('opCode');

var PlayerMove = function (_Action) {
  _inherits(PlayerMove, _Action);

  function PlayerMove() {
    _classCallCheck(this, PlayerMove);

    return _possibleConstructorReturn(this, (PlayerMove.__proto__ || Object.getPrototypeOf(PlayerMove)).call(this, OPCode.PLAYER_MOVE));
  }

  return PlayerMove;
}(Action);

module.exports = PlayerMove;

},{"client/actions/Action":7,"opCode":26}],11:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Action = require('client/actions/Action');
var OPCode = require('opCode');

var SpawnPlayer = function (_Action) {
  _inherits(SpawnPlayer, _Action);

  function SpawnPlayer() {
    _classCallCheck(this, SpawnPlayer);

    return _possibleConstructorReturn(this, (SpawnPlayer.__proto__ || Object.getPrototypeOf(SpawnPlayer)).call(this, OPCode.SPAWN_PLAYER));
  }

  return SpawnPlayer;
}(Action);

module.exports = SpawnPlayer;

},{"client/actions/Action":7,"opCode":26}],12:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Action = require('client/actions/Action');
var OPCode = require('opCode');

var UpdatePlayers = function (_Action) {
  _inherits(UpdatePlayers, _Action);

  function UpdatePlayers() {
    _classCallCheck(this, UpdatePlayers);

    return _possibleConstructorReturn(this, (UpdatePlayers.__proto__ || Object.getPrototypeOf(UpdatePlayers)).call(this, OPCode.UPDATE_PLAYERS));
  }

  _createClass(UpdatePlayers, null, [{
    key: 'eventName',
    get: function get() {
      return 'updatePlayers';
    }
  }]);

  return UpdatePlayers;
}(Action);

module.exports = UpdatePlayers;

},{"client/actions/Action":7,"opCode":26}],13:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Action = require('client/actions/Action');
var OPCode = require('opCode');

var UpdateSpells = function (_Action) {
  _inherits(UpdateSpells, _Action);

  function UpdateSpells() {
    _classCallCheck(this, UpdateSpells);

    return _possibleConstructorReturn(this, (UpdateSpells.__proto__ || Object.getPrototypeOf(UpdateSpells)).call(this, OPCode.UPDATE_SPELLS));
  }

  _createClass(UpdateSpells, null, [{
    key: 'eventName',
    get: function get() {
      return 'updateSpells';
    }
  }]);

  return UpdateSpells;
}(Action);

module.exports = UpdateSpells;

},{"client/actions/Action":7,"opCode":26}],14:[function(require,module,exports){
'use strict';

var _module$exports;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var OPCode = require('opCode');

module.exports = (_module$exports = {}, _defineProperty(_module$exports, OPCode.ADD_PLAYER, require('client/actions/AddPlayer')), _defineProperty(_module$exports, OPCode.CAST_SPELL, require('client/actions/CastSpell')), _defineProperty(_module$exports, OPCode.SPAWN_PLAYER, require('client/actions/SpawnPlayer')), _defineProperty(_module$exports, OPCode.UPDATE_PLAYERS, require('client/actions/UpdatePlayers')), _defineProperty(_module$exports, OPCode.UPDATE_SPELLS, require('client/actions/UpdateSpells')), _defineProperty(_module$exports, OPCode.PLAYER_MOVE, require('client/actions/PlayerMove')), _module$exports);

},{"client/actions/AddPlayer":8,"client/actions/CastSpell":9,"client/actions/PlayerMove":10,"client/actions/SpawnPlayer":11,"client/actions/UpdatePlayers":12,"client/actions/UpdateSpells":13,"opCode":26}],15:[function(require,module,exports){
'use strict';

var _KeyCode = require('client/util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _DomElement = require('client/util/DomElement');

var _DomElement2 = _interopRequireDefault(_DomElement);

var _Graph = require('client/Graph');

var _Graph2 = _interopRequireDefault(_Graph);

var _Game = require('client/Game');

var _Game2 = _interopRequireDefault(_Game);

var _statistics = require('client/statistics');

var Statistics = _interopRequireWildcard(_statistics);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('client/util/polyfills');

var OPCode = require('opCode');

var animationLoopHandle;
var lastUpdate;
var targetTick = performance.now();
var mouse = { x: 0, y: 0 };
var scrollDirection = null;
var game = _Game2.default.getInstance();

var canvas = new _DomElement2.default('.js-canvas', _Graph2.default);
var graph = canvas.instance;

var playerNameElement = new _DomElement2.default('.js-player-name');
var playButtonElement = new _DomElement2.default('.js-play-button');
var errorElement = new _DomElement2.default('.js-error');

if (playButtonElement.htmlElement) {
  playButtonElement.on('mouseup', startGame);
}

if (playerNameElement.htmlElement) {
  playerNameElement.on('keyup', validate);
}

function validate(event) {
  if (~[_KeyCode2.default.ENTER, _KeyCode2.default.MAC_ENTER].indexOf(event.keyCode)) {
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
}

function animationLoop(timestamp) {
  animationLoopHandle = window.requestAnimationFrame(animationLoop);

  gameLoop(timestamp - lastUpdate);
  lastUpdate = timestamp;
}

function gameLoop(deltaT) {
  graph.clear().updateOffset(scrollDirection).drawGrid().drawArena().drawSpells(game.spellList).drawPlayers(game.playerList).drawDebug();

  game.update();
}

function startGame() {
  new _DomElement2.default('.js-start-menu').htmlElement.style.display = 'none';

  game.startGame(playerNameElement.htmlElement.value, function () {
    window.document.addEventListener('keydown', wHandleKeyDown);

    canvas.on('contextmenu', function (event) {
      return event.preventDefault();
    });
    canvas.on('mousemove', cHandleMouseMove);
    canvas.on('mousedown', cHandleMouseDown);
  });

  game.on('addPlayer', function () {
    return graph.player = game.currentPlayer;
  });

  if (!animationLoopHandle) {
    lastUpdate = Date.now();
    animationLoop(lastUpdate);
  }

  function cHandleMouseMove(event) {
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
  }

  function cHandleMouseDown(event) {
    if (game.currentPlayer && event.button === _KeyCode2.default.MOUSE2) {
      event.preventDefault();
      event.stopPropagation();
      var now = performance.now();
      var diff = now - targetTick;
      if (diff > 100) {
        var targetX = mouse.x + graph.xOffset;
        var targetY = mouse.y + graph.yOffset;
        targetX = Math.min(Math.max(targetX, 0), graph._gameWidth);
        targetY = Math.min(Math.max(targetY, 0), graph._gameHeight);
        game.currentPlayer.setTarget({ x: targetX, y: targetY });
        targetTick = now;
        game.controller.send(OPCode.PLAYER_MOVE, game.currentPlayer);
        // game.controller.move(game.currentPlayer);
      }
    }
  }

  function wHandleKeyDown(event) {
    switch (event.keyCode) {
      case _KeyCode2.default.SPACE:
        game.controller.send(OPCode.CAST_SPELL, {
          type: OPCode.SPELL_PRIMARY,
          playerX: game.currentPlayer.position.x,
          playerY: game.currentPlayer.position.y,
          x: mouse.x + graph.xOffset,
          y: mouse.y + graph.yOffset
        });
        // game.controller.cast(OPCode.CAST_PRIMARY, {
        //   playerX: game.currentPlayer.position.x,
        //   playerY: game.currentPlayer.position.y,
        //   x: mouse.x + graph.xOffset,
        //   y: mouse.y + graph.yOffset
        // });
        //For testing purposes only
        var scoreHolder = Statistics.Score.getInstance();
        scoreHolder.add();
        break;
    }
  }
}

},{"client/Game":4,"client/Graph":5,"client/statistics":21,"client/util/DomElement":22,"client/util/KeyCode":24,"client/util/polyfills":25,"opCode":26}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
    this._maxRadius = 25;
    this._rotationTicks = this._baseRotationTicks;
    this._castTicks = this._baseCastTicks;
    this._friction = this._baseFriction;
    this._animateCast = false;

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
      if (this._animateCast) {
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
        this._friction = this._baseFriction;
      }
    }
  }, {
    key: 'onCast',
    value: function onCast(spell) {
      this._animateCast = true;
      this.targetRotation = Math.atan2(spell.target.y - this.position.y, spell.target.x - this.position.x);
    }
  }, {
    key: '_calculatePosition',
    value: function _calculatePosition(deltaT) {
      if (!this._arePositionsApproximatelyEqual(this.position, this.target) || this.stunned) {
        if (this._friction < 1) {
          this._friction += this.acceleration;
        }

        var speed = this.speed * this._friction;
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
        this._friction = this._baseFriction;
        this.velocity = { x: 0, y: 0 };
      }
    }
  }, {
    key: '_calculateRotation',
    value: function _calculateRotation(deltaT) {
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
          this._rotationTicks = this._baseRotationTicks;
        }
      }
    }
  }, {
    key: '_updateAnimation',
    value: function _updateAnimation() {
      if (this._castTicks > 0) {
        var sign = Math.sign(this._castTicks - this._baseCastTicks / 2);
        this.radius += sign * (this._maxRadius - this.radius) / 4;
        this._castTicks--;
      } else {
        this.radius = this._baseRadius;
        this._castTicks = this._baseCastTicks;
        this._animateCast = false;
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

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Player = require('client/models/Player');

Object.defineProperty(exports, 'Player', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Player).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"client/models/Player":16}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Primary = require('client/spells/Primary');

Object.defineProperty(exports, 'Primary', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Primary).default;
  }
});
exports.get = get;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OPCode = require('opCode');

function get(code) {
  var spell = null;

  switch (code) {
    case OPCode.SPELL_PRIMARY:
      spell = module.exports.Primary;
      break;
  }

  return spell;
}

},{"client/spells/Primary":18,"opCode":26}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;

var Score = function () {
    function Score() {
        _classCallCheck(this, Score);

        this._score = 0;
    }

    _createClass(Score, [{
        key: "add",
        value: function add() {
            var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            this._score += s;
        }
    }, {
        key: "currentScore",
        value: function currentScore() {
            return this._score;
        }
    }], [{
        key: "getInstance",
        value: function getInstance() {
            if (instance) {
                return instance;
            } else {
                instance = new Score();
                return instance;
            }
        }
    }]);

    return Score;
}();

exports.default = Score;

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Score = require('./Score');

Object.defineProperty(exports, 'Score', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Score).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./Score":20}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
      if (!~this._eventHandlers[name].indexOf(listener)) {
        this._eventHandlers[name].push(listener);

        this.htmlElement.addEventListener(name, listener);
      }

      return this;
    }
  }]);

  return DomElement;
}();

exports.default = DomElement;

},{}],23:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this._eventHandlers = {};
  }

  _createClass(EventEmitter, [{
    key: "on",
    value: function on(name, listener) {
      if (!(name in this._eventHandlers) || !(this._eventHandlers[name] instanceof Array)) {
        this._eventHandlers[name] = [];
      }
      this._eventHandlers[name].push(listener);
    }
  }, {
    key: "_fire",
    value: function _fire(name, options) {
      if (name in this._eventHandlers && this._eventHandlers[name].length > 0) {
        this._eventHandlers[name].forEach(function (handler) {
          return handler(options);
        });
      }
    }
  }]);

  return EventEmitter;
}();

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  MOUSE2: 2,
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

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
"use strict";

var operations = ["PING", "PONG", "SPAWN_PLAYER", "ADD_PLAYER", "UPDATE_PLAYERS", "UPDATE_SPELLS", "PLAYER_MOVE", "CAST_SPELL",

// cast
"CAST_PRIMARY",

// spells
"SPELL_PRIMARY",

// models
"MODEL_PLAYER",

// direction
"DIRECTION_WEST", "DIRECTION_EAST", "DIRECTION_NORTH", "DIRECTION_SOUTH", "DIRECTION_NWEST", "DIRECTION_NEAST", "DIRECTION_SWEST", "DIRECTION_SEAST",

// types
"TYPE_SPELL", "TYPE_MODEL", "TYPE_GAMEMODE", "TYPE_MAP"];

var opCodes = {};

operations.forEach(function (op, index) {
  return opCodes[op] = ++index;
});

module.exports = opCodes;

module.exports.getName = function (opCode) {
  for (var propertyName in opCodes) {
    if (opCodes[propertyName] === opCode) {
      return propertyName;
    }
  }

  return null;
};

},{}],27:[function(require,module,exports){
'use strict';

var Schema = require('../Schema');
var OPCode = require('../opCode');

module.exports = new Schema(OPCode.ADD_PLAYER, {
  id: 'string',
  ownerId: 'string',
  name: 'string',
  health: 'uint16le',
  maxHealth: 'uint16le',
  x: 'float32le',
  y: 'float32le',
  r: 'uint8',
  g: 'uint8',
  b: 'uint8'
}, function (player) {
  return {
    id: player.id,
    ownerId: player.ownerId,
    name: player.name,
    health: player.health,
    maxHealth: player.maxHealth,
    position: { x: player.x, y: player.y },
    color: { r: player.r, g: player.g, b: player.b }
  };
});

},{"../Schema":3,"../opCode":26}],28:[function(require,module,exports){
'use strict';

var Schema = require('../Schema');
var OPCode = require('../opCode');

module.exports = new Schema(OPCode.CAST_SPELL, {
  type: 'uint8',
  playerX: 'uint16le',
  playerY: 'uint16le',
  x: 'uint16le',
  y: 'uint16le'
});

},{"../Schema":3,"../opCode":26}],29:[function(require,module,exports){
'use strict';

var Schema = require('../Schema');
var OPCode = require('../opCode');

module.exports = new Schema(OPCode.PLAYER_MOVE, {
  x: 'uint16le',
  y: 'uint16le'
});

},{"../Schema":3,"../opCode":26}],30:[function(require,module,exports){
'use strict';

var Schema = require('../Schema');
var OPCode = require('../opCode');

module.exports = new Schema(OPCode.SPAWN_PLAYER, {
  name: { type: 'string' }
}, function (obj) {
  return obj.name || '';
});

},{"../Schema":3,"../opCode":26}],31:[function(require,module,exports){
'use strict';

var Schema = require('../Schema');
var OPCode = require('../opCode');

module.exports = new Schema(OPCode.UPDATE_PLAYERS, {
  updatedPlayers: [{
    id: 'string',
    ownerId: 'string',
    name: 'string',
    health: 'uint16le',
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
}, function (object) {
  var updatedPlayers = object.updatedPlayers.map(function (player) {
    return {
      id: player.id,
      ownerId: player.ownerId,
      name: player.name,
      health: player.health,
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
});

},{"../Schema":3,"../opCode":26}],32:[function(require,module,exports){
'use strict';

var Schema = require('../Schema');
var OPCode = require('../opCode');

module.exports = new Schema(OPCode.UPDATE_SPELLS, {
  updatedSpells: [{
    id: 'string',
    ownerId: 'string',
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
}, function (object) {
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
});

},{"../Schema":3,"../opCode":26}],33:[function(require,module,exports){
'use strict';

var _schemas;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var OPCode = require('../opCode');

var schemas = (_schemas = {}, _defineProperty(_schemas, OPCode.ADD_PLAYER, require('./AddPlayer')), _defineProperty(_schemas, OPCode.CAST_SPELL, require('./CastSpell')), _defineProperty(_schemas, OPCode.PLAYER_MOVE, require('./PlayerMove')), _defineProperty(_schemas, OPCode.SPAWN_PLAYER, require('./SpawnPlayer')), _defineProperty(_schemas, OPCode.UPDATE_PLAYERS, require('./UpdatePlayers')), _defineProperty(_schemas, OPCode.UPDATE_SPELLS, require('./UpdateSpells')), _schemas);

module.exports.get = function (opCode) {
  if (opCode in schemas) {
    return schemas[opCode];
  } else {
    console.error('Unable to find schema for ' + OPCode.getName(opCode) + '.');
  }
};

},{"../opCode":26,"./AddPlayer":27,"./CastSpell":28,"./PlayerMove":29,"./SpawnPlayer":30,"./UpdatePlayers":31,"./UpdateSpells":32}]},{},[15])


//# sourceMappingURL=game.js.map
