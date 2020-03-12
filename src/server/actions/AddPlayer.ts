import Action from 'server/actions/Action';
import { OperationCode } from 'common/OperationCode';
import { Socket } from 'server/Socket';

export default class AddPlayer extends Action {

  constructor(socket: Socket) {
    super(OperationCode.ADD_PLAYER, socket);
  }

}
