const Action = require('client/actions/Action');
const OPCode = require('common/opCode');

class AddPlayer extends Action {

  constructor() {
    super(OPCode.ADD_PLAYER);
  }

  static get eventName() {
    return 'addPlayer';
  }
}

module.exports = AddPlayer;