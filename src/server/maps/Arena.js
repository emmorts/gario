const Map = require('./Map');

class Arena extends Map {
  constructor() {
    super();
    
    this.width = 1000;
    this.height = 1000;
  }
}

module.exports = Arena;