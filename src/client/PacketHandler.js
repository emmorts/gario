const BufferCodec = require('buffercodec');
const EventEmitter = require('common/EventEmitter');
const Action = require('client/actions');
const OPCode = require('common/opCode');
const Logger = require('client/Logger');
const config = require('client/config');

class PacketHandler {
  constructor() {
    EventEmitter.attach(this);

    this._uri = `${config.protocol}://${config.gameServer}`;
    this._socket = null;

    this._setupSocket();
  }

  send(opCode, object) {
    Logger.trace(`SCK > ${OPCode.getName(opCode)}`);

    if (opCode in Action) {
      const action = new Action[opCode](this._socket);
      const buffer = action.build(object);

      if (buffer) {
        this._socket.send(buffer);
      }
    } else {
      Logger.error(`Operation '${OPCode.getName(opCode)}' does not cover any action.'`);
    }
  }

  _setupSocket() {
    this._socket = new WebSocket(this._uri);
    this._socket.binaryType = 'arraybuffer';

    this._socket.onopen = () => {
      this.fire('open');

      this._socket.onmessage = this._handleMessage.bind(this);
    };
  }

  _handleMessage(message) {
    const codec = BufferCodec(message.data);
    const code = PacketHandler._getOpCode(codec);

    // Omit PING packets from logging, think of how to remove the conditional
    if (code !== OPCode.PING) {
      Logger.trace(`SCK < ${OPCode.getName(code)}`);
    }

    if (code in Action) {
      const ActionClass = Action[code];
      const action = new ActionClass(this._socket);
      const buffer = codec.getBuffer(true);

      const actionResult = action.execute(buffer);

      if (ActionClass.eventName) {
        this.fire(ActionClass.eventName, actionResult);
      }
    } else {
      Logger.error(`Operation '${OPCode.getName(code)}' does not cover any action.'`);
    }
  }

  static _getOpCode(codec) {
    return codec.parse({ code: 'uint8' }, obj => obj.code);
  }
}

module.exports = PacketHandler;
