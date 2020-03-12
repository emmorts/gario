import Action from 'server/actions/Action';
import { OperationCode } from 'common/OperationCode';
import { Socket } from 'server/Socket';

export default class Ping extends Action {

  constructor(socket: Socket) {
    super(OperationCode.PING, socket);
  }

  build() {
    if (this.actionSchema) {
      return this.actionSchema.encode({
        timestamp: `${Date.now()}`,
      });
    }

    return null;
  }

}
