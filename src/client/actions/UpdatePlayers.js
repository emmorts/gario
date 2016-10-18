const Action = require('client/actions/Action');
const OPCode = require('opCode');

class UpdatePlayers extends Action {

  static get eventName() {
    return 'updatePlayers';
  }

  constructor() {
    super(OPCode.UPDATE_PLAYERS);
  }

}

module.exports = UpdatePlayers;