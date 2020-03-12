import Action from 'server/actions/Action';
import { OperationCode } from 'common/OperationCode';
import { Socket } from 'server/Socket';

export default class CastSpell extends Action {

  constructor(socket: Socket) {
    super(OperationCode.CAST_SPELL, socket);
  }

  get eventName() {
    return 'castSpell';
  }

  execute(buffer: ArrayBuffer) {
    const spell = this.parse(buffer);

    this.socket.playerController.cast(spell);

    return spell;
  }

}
