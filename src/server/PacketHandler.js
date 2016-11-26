const WebSocket = require('ws');
const OPCode = require('common/opCode');
const BufferCodec = require('buffercodec');
const EventEmitter = require('common/EventEmitter');
const Action = require('server/actions');
const Logger = require('server/Logger');

class PacketHandler {
  constructor(gameServer, socket) {
    EventEmitter.attach(this);

    this.gameServer = gameServer;
    this.socket = socket;

    this.ping();
  }

  send(opCode, object) {
    Logger.debug(`> ${OPCode.getName(opCode)}`);

    if (opCode in Action) {
      const action = new Action[opCode](this.gameServer, this.socket);
      const buffer = action.build(object);

      if (buffer) {
        this._sendBuffer(buffer);
      }
    } else {
      Logger.error(`Operation '${OPCode.getName(opCode)}' does not cover any action.'`);
    }
  }

  handleMessage(message) {
    if (message && message.length) {
      const codec = BufferCodec(message);
      const code = codec.parse({ code: 'uint8' }, obj => obj.code);

      // Omit PONG packets, think of how to remove the conditional
      if (code !== OPCode.PONG) {
        Logger.debug(`< ${OPCode.getName(code)}`);
      }

      if (code in Action) {
        const ActionClass = Action[code];
        const action = new ActionClass(this.gameServer, this.socket);
        const buffer = codec.getBuffer(true);

        const actionResult = action.execute(buffer);

        if (ActionClass.eventName) {
          this.fire(ActionClass.eventName, actionResult);
        }
      } else {
        Logger.error(`Operation '${OPCode.getName(code)}' does not cover any action.'`);
      }
    } else {
      Logger.log('An empty message was received.');
    }
  }

  ping() {
    const action = new Action[OPCode.PING](this.gameServer, this.socket);
    const buffer = action.build();

    if (buffer) {
      this._sendBuffer(buffer);
    }
  }

  _sendBuffer(buffer) {
    if (!buffer) {
      Logger.log('Empty buffer received, skipping message.');
    } else if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(buffer, { binary: true }, (error) => {
        if (error) {
          Logger.warn(`Failed to send a message('${error}').`);
        }
      });
    } else {
      Logger.log('Socket is not open, closing connection.');

      this.socket.readyState = WebSocket.CLOSED;
      this.socket.emit('close');
      this.socket.removeAllListeners();
    }
  }
}

module.exports = PacketHandler;
