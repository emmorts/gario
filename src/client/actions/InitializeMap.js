const Action = require('client/actions/Action');
const OPCode = require('common/opCode');

class InitializeMap extends Action {

  constructor() {
    super(OPCode.INITIALIZE_MAP);
  }

  static get eventName() {
    return 'initializeMap';
  }

}

module.exports = InitializeMap;
