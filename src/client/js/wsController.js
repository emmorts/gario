/* global OPCode */

var WSController = (function () {

  function WSController(options) {
    options = options || {};
    this._uri = options.uri || 'ws://localhost:3000';

    setupSocket.call(this);
  }

  function setupSocket() {
    this._socket = new WebSocket(this._uri);
    this._socket.binaryType = 'arraybuffer';

    this._socket.onopen = function (event) {
      console.log("WebSocket is now open");

      this._socket.onmessage = function (message) {
        if (message.data instanceof ArrayBuffer) {
          if (message.data.byteLength === 1) {
            var code = (new Uint8Array(message.data));

            switch (code[0]) {
              case OPCode.SYN:
                var array = new Uint8Array(1);
                array[0] = OPCode.ACK;
                this._socket.send(array.buffer);
                break;
              case OPCode.JOINED:
                console.log("Spawn player");
                break;
              default:
                console.warn("Undefined opcode");
                break;
            }
          }
        } else {
          console.warn("Received malformed data");
        }
      }.bind(this)
    }.bind(this)
  }

  return WSController;

})();