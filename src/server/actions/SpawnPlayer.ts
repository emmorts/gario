import Action from 'server/actions/Action';
import { OperationCode } from 'common/OperationCode';
import { Socket } from 'server/Socket';

export default class SpawnPlayer extends Action {

  constructor(socket: Socket) {
    super(OperationCode.SPAWN_PLAYER, socket);
  }

  execute(buffer: ArrayBuffer) {
    const object = this.parse(buffer);

    this.socket.playerController.spawn(object);
  }

}
