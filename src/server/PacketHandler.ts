import { BufferCodec } from 'buffercodec';
import { OperationCode } from 'common/OperationCode';
import { EventEmitter } from 'common/EventEmitter';
import Action from 'server/actions';
import Logger from 'server/Logger';
import { Socket } from 'server/Socket';

export default class PacketHandler {
  listener = new EventEmitter<string>();

  #socket: Socket;

  constructor(socket: Socket) {
    this.#socket = socket;

    this.ping();
  }

  send(opCode: OperationCode, object: any) {
    Logger.trace(`SCK > ${OperationCode[opCode]}`);

    if (opCode in Action) {
      const action = new Action[opCode](this.#socket);
      const buffer = action.build(object);

      if (buffer) {
        this._sendBuffer(buffer);
      }
    } else {
      Logger.error(`Operation '${OperationCode[opCode]}' does not cover any action.'`);
    }
  }

  handleMessage(message: ArrayBuffer) {
    if (message && message.byteLength) {
      const codec = BufferCodec.from(message);
      const code = codec.decode({ type: 'uint8' }) as OperationCode;

      // Omit PONG packets from logging, think of how to remove the conditional
      if (code !== OperationCode.PONG) {
        Logger.trace(`SCK < ${OperationCode[code]}`);
      }

      if (code in Action) {
        const ActionClass = Action[code];
        const action = new ActionClass(this.#socket);

        const actionResult = action.execute(codec.buffer);

        if (action.eventName) {
          this.listener.fire(action.eventName, actionResult);
        }
      } else {
        Logger.error(`Operation '${OperationCode[code]}' does not cover any action.'`);
      }
    } else {
      Logger.info('An empty message was received.');
    }
  }

  ping() {
    const action = new Action[OperationCode.PING](this.#socket);
    const buffer = action.build();

    if (buffer) {
      this._sendBuffer(buffer);
    }
  }

  _sendBuffer(buffer: ArrayBuffer) {
    if (!buffer) {
      Logger.info('Empty buffer received, skipping message.');

      return;
    }
    
    if (this.#socket.readyState === WebSocket.OPEN) {
      this.#socket.send(buffer, { binary: true }, error => {
        if (error) {
          Logger.warn(`Failed to send a message ('${error}').`);
        }
      });
    } else {
      Logger.info('Socket is not open, closing connection.');

      this.#socket.readyState = WebSocket.CLOSED;
      this.#socket.emit('close');
      this.#socket.removeAllListeners();
    }
  }
}
