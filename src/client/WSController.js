const BufferCodec = require('buffercodec');
const EventEmitter = require('EventEmitter');
const Action = require('client/actions');
const OPCode = require('opCode');
const Schema = require('schemas');

class WSController extends EventEmitter {
  constructor() {
    super();

    this._uri = 'ws://127.0.0.1:3000';
    this._socket = null;

    this._setupSocket();
  }

  send(opCode, object) {
    if (opCode in Action) {
      const action = new Action[opCode]();
      const buffer = action.build(object);

      if (buffer) {
        this._socket.send(buffer);
      }
    } else {
      console.error(`Operation '${OPCode.getName(opCode)}' does not cover any action.'`);
    }
  }

  _setupSocket() {
    this._socket = new WebSocket(this._uri);
    this._socket.binaryType = 'arraybuffer';

    this._socket.onopen = event => {
      this._fire('open');

      this._socket.onmessage = this._handleMessage.bind(this);
    };
  }

  _handleMessage(message) {
    const codec = BufferCodec(message.data);
    const code = this._getOpCode(codec);

    if (code in Action) {
      const ActionClass = Action[code];
      const action = new ActionClass();
      const buffer = codec.getBuffer(true);

      const actionResult = action.execute(buffer);

      if (ActionClass.eventName) {
        this._fire(ActionClass.eventName, actionResult);
      }
    } else {
      console.error(`Operation '${OPCode.getName(code)}' does not cover any action.'`);
    }
  }

  _getOpCode(codec) {
    return codec.parse({ code: 'uint8' }, obj => obj.code);
  }
}

module.exports = WSController;