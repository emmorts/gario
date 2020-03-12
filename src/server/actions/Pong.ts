import Action from 'server/actions/Action';
import { OperationCode } from 'common/OperationCode';
import { Socket } from 'server/Socket';

export default class Pong extends Action {

  constructor(socket: Socket) {
    super(OperationCode.PONG, socket);
  }

  execute() {
    this.socket.packetHandler.ping();
  }

}
