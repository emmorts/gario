const BufferCodec = require('buffercodec');
const OPCode = require('../../opCode');

class AddPlayer {

  constructor (node) {
    this.node = node;
  }

  build() {
    return BufferCodec()
      .uint8(OPCode.ADD_PLAYER)
      .string(this.node.id)
      .string(this.node.ownerId)
      .uint8(this.node.owner.name.length)
      .string(this.node.owner.name)
      .uint16le(this.node.health)
      .uint16le(this.node.maxHealth)
      .float32le(this.node.position.x)
      .float32le(this.node.position.y)
      .uint8(this.node.color.r)
      .uint8(this.node.color.g)
      .uint8(this.node.color.b)
      .result();
  }

}

module.exports = AddPlayer;