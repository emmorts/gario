const Action = require('client/actions/Action');
const OPCode = require('common/opCode');

class UpdatePlayers extends Action {

  constructor() {
    super(OPCode.UPDATE_PLAYERS);
  }

  static get eventName() {
    return 'updatePlayers';
  }

}

module.exports = UpdatePlayers;
