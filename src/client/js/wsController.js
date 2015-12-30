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
        if (message.data instanceof ArrayBuffer) {
          var data = new DataView(message.data);
          var code = data.getUint8(0);

          switch (code) {
            case OPCode.SYN:
              this.__acknoledged = true;
              var array = new Uint8Array(1);
              array[0] = OPCode.ACK;
              this.__socket.send(array.buffer);
              fire.call(this, 'acknowledged');
              break;
            case OPCode.JOINED:
              fire.call(this, 'joined');
              break;
            case OPCode.UPLAYERS:
              fire.call(this, 'updatePlayers');
              break;
            default:
              console.warn("Undefined opcode");
              break;
          }
        } else {
          console.warn("Received malformed data");
        }
      }.bind(this)
    }.bind(this)
  }
  
  WSController.prototype.spawn = function () {
    var array = new Uint8Array(1);
    array[0] = OPCode.SPAWN;
    this.__socket.send(array.buffer);
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