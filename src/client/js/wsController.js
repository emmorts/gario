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
        var code = codec.getOpcode();
        
        switch (code) {
          case OPCode.ADD_NODE:
            var node = codec.parse([{
              name: 'id',
              length: 32,
              type: 'string'
            }, {
              name: 'name',
              type: 'string'
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
            var nodes = codec.parse([{
              type: 'array',
              itemTemplate: [{
                name: 'id',
                length: 32,
                type: 'string'
              }, {
                name: 'x',
                type: 'floatle'
              }, {
                name: 'y',
                type: 'floatle'
              }]
            }]);
            fire.call(this, 'updateNodes', nodes);
            break;
          default:
            console.warn("Undefined opcode");
            break;
        }
      }.bind(this)
    }.bind(this)
  }
  
  WSController.prototype.spawn = function (playerName) {
    var buffer = new ArrayBuffer(2 + playerName.length * 2);
    var uint8view = new Uint8Array(buffer); 
    uint8view[0] = OPCode.SPAWN;
    uint8view[1] = playerName.length;
    if (playerName.length > 0) {
      var bufferView = new Uint16Array(buffer, 2);
      for (var i = 0, strLen = playerName.length; i < strLen; i++) {
        bufferView[i] = playerName.charCodeAt(i);
      }
    }
    this.__socket.send(buffer);
  }
  
  WSController.prototype.mouseMove = function (mouse) {
    var buffer = new ArrayBuffer(9);
    var view = new DataView(buffer);
    view.setUint8(0, OPCode.MOUSE_MOVE);
    view.setFloat32(1, mouse.x, true);
    view.setFloat32(5, mouse.y, true);
    this.__socket.send(view.buffer);
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