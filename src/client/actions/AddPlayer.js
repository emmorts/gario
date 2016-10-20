const Action = require('client/actions/Action');
const OPCode = require('common/opCode');

class AddPlayer extends Action {

  static get eventName() {
    return 'addPlayer';
  }

  constructor() {
    super(OPCode.ADD_PLAYER);
  }

}

module.exports = AddPlayer;