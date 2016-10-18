const Action = require('client/actions/Action');
const OPCode = require('opCode');

class AddPlayer extends Action {

  static get eventName() {
    return 'addPlayer';
  }

  constructor() {
    super(OPCode.ADD_PLAYER);
  }

}

module.exports = AddPlayer;