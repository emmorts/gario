var BufferCodec = require('buffercodec');
var OPCode = require('../../opCode')

function WSController() {
  this.__uri = 'ws://localhost:3000';
  this.__acknoledged = false;
  this.__socket = null;
  this.__eventHandlers = [];

  setupSocket.call(this);
}

WSController.prototype.spawn = function (playerName) {
  var buffer = BufferCodec()
    .uint8(OPCode.SPAWN_PLAYER)
    .uint8(playerName.length)
    .string(playerName)
    .result();
  this.__socket.send(buffer);
}

WSController.prototype.move = function (player) {
  var buffer = BufferCodec()
    .uint8(OPCode.PLAYER_MOVE)
    .uint16le(player.target.x)
    .uint16le(player.target.y)
    .result();

  this.__socket.send(buffer);
}

WSController.prototype.cast = function (opcode, mouse) {
  var buffer = BufferCodec()
    .uint8(opcode)
    .uint16le(mouse.x)
    .uint16le(mouse.y)
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
    this.__eventHandlers[name].forEach(handler => handler(options));
  }
}

function setupSocket() {
  this.__socket = new WebSocket(this.__uri);
  this.__socket.binaryType = 'arraybuffer';

  this.__socket.onopen = function (event) {
    fire.call(this, 'open');

    this.__socket.onmessage = function handleMessage(message) {
      var codec = BufferCodec(message.data);
      var code = codec.parse({ type: 'uint8' });

      switch (code) {
        case OPCode.ADD_PLAYER:
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
          fire.call(this, 'addPlayer', node);
          break;
        case OPCode.UPDATE_PLAYERS:
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
          fire.call(this, 'updatePlayers', {
            destroyedNodes: destroyedNodes,
            updatedNodes: updatedNodes
          });
          break;
        case OPCode.UPDATE_SPELLS:
          var updatedSpells = codec.parse({
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
                name: 'type',
                type: 'uint8'
              }, {
                name: 'mass',
                type: 'uint8'
              }, {
                name: 'power',
                type: 'uint8'
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
          var destroyedSpells = codec.parse({
            type: 'array',
            itemTemplate: { type: 'string', length: 32 }
          });
          fire.call(this, 'updateSpells', {
            destroyedSpells: destroyedSpells,
            updatedSpells: updatedSpells
          });
          break;
        default:
          console.warn("Undefined opcode");
          break;
      }
    }.bind(this)
  }.bind(this)
}

module.exports = WSController;