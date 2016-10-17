const Action = require('client/actions/Action');
const OPCode = require('opCode');

class UpdatePlayers extends Action {

  static get eventName() {
    return 'updatePlayers';
  }

  constructor() {
    super(OPCode.UPDATE_PLAYERS);
  }

  execute(buffer) {
    return this.parse(buffer);
  }

}

module.exports = UpdatePlayers;