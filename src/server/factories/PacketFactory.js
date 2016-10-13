const packets = require('packets');

class PacketFactory {

  static instantiate(type) {
    if (packets) {
      const args = Array.prototype.slice.call(arguments, 1);
      const packet = packets[type];

      if (packet) {
        return new packet(...args);
      }
    }

    return null;
  }

}

module.exports = PacketFactory;