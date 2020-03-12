import Action from 'server/actions/Action';
import { OperationCode } from 'common/OperationCode';
import { Socket } from 'server/Socket';

export default class PlayerMove extends Action {

  constructor(socket: Socket) {
    super(OperationCode.PLAYER_MOVE, socket);
  }

  execute(buffer: ArrayBuffer) {
    const target = this.parse(buffer);

    this.socket.playerController.setTarget(target);
  }

}
