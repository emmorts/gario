const OPCode = require('opCode');
const BufferCodec = require('buffercodec');
const EventEmitter = require('EventEmitter');
const Action = require('server/actions');

class PacketHandler extends EventEmitter {
  constructor(gameServer, socket) {
    this.gameServer = gameServer;
    this.socket = socket;
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
          this._fire(ActionClass.eventName, actionResult);
        }
      } else {
        console.error(`Operation '${OPCode.getName(code)}' does not cover any action.'`);
      }
    } else {
      console.log("An empty message was received.");
    }
  }
}

module.exports = PacketHandler;