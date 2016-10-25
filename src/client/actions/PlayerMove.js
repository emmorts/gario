const Action = require('client/actions/Action');
const OPCode = require('common/opCode');

class PlayerMove extends Action {

  constructor() {
    super(OPCode.PLAYER_MOVE);
  }

  static get eventName() {
    return 'playerMove';
  }

  build(object) {
    if (this.actionSchema) {
      return this.actionSchema.encode({
        x: object.target.x,
        y: object.target.y
      });
    }

    return null;
  }

}

module.exports = PlayerMove;