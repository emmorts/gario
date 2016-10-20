const WebSocket = require('ws');
const OPCode = require('common/opCode');
const BufferCodec = require('buffercodec');
const EventEmitter = require('common/EventEmitter');
const Action = require('server/actions');

class PacketHandler extends EventEmitter {
  constructor(gameServer, socket) {
    super();
    
    this.gameServer = gameServer;
    this.socket = socket;
  }

  send(opCode, object) {
    if (opCode in Action) {
      const action = new Action[opCode]();
      const buffer = action.build(object);

      if (buffer) {
        this._sendBuffer(buffer);
      }
    } else {
      console.error(`Operation '${OPCode.getName(opCode)}' does not cover any action.'`);
    }
  }

  handleMessage(message) {
    if (message && message.length) {
      const codec = BufferCodec(message);
      const code = codec.parse({ code: 'uint8' }, obj => obj.code);

      if (code in Action) {
        const ActionClass = Action[code]; 
        const action = new ActionClass(this.gameServer, this.socket);
        const buffer = codec.getBuffer(true);

        const actionResult = action.execute(buffer);

        if (ActionClass.eventName) {
          this.fire(ActionClass.eventName, actionResult);
        }
      } else {
        console.error(`Operation '${OPCode.getName(code)}' does not cover any action.'`);
      }
    } else {
      console.log("An empty message was received.");
    }
  }

  _sendBuffer(buffer) {
    if (!buffer) {
      console.log('Empty buffer received, skipping message.');
    } else if (this.socket.readyState == WebSocket.OPEN) {
      this.socket.send(buffer, { binary: true }, error => {
        if (error) {
          console.log(`Failed to send a message('${error}').`);
        }
      });
    } else {
      console.log('Socket is not open, closing connection.');

      this.socket.readyState = WebSocket.CLOSED;
      this.socket.emit('close');
      this.socket.removeAllListeners();
    }
  }
}

module.exports = PacketHandler;