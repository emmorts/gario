import Action from 'server/actions/Action';
import { OperationCode } from 'common/OperationCode';
import { Socket } from 'server/Socket';

export default class Collision extends Action {

  constructor(socket: Socket) {
    super(OperationCode.COLLISION, socket);
  }

  get eventName() {
    return 'castSpell';
  }

  execute(buffer: ArrayBuffer) {
    return this.parse(buffer);
  }

}
