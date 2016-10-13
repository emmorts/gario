const Action = require('actions/Action');
const OPCode = require('shared/opCode');

class UpdatePlayers extends Action {

  constructor() {
    super(OPCode.UPDATE_PLAYERS);
  }

  static get eventName() {
    return 'updatePlayers';
  }
  
}

module.exports = UpdatePlayers;