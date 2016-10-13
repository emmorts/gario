const Action = require('actions/Action');
const OPCode = require('shared/opCode');

class AddPlayer extends Action {

  constructor() {
    super(OPCode.ADD_PLAYER);
  }

  static get eventName() {
    return 'addPlayer';
  }
  
}

module.exports = AddPlayer;