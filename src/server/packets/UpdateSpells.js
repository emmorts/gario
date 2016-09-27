const BufferCodec = require('buffercodec');
const OPCode = require('../../opCode');

class UpdateSpells {

  constructor(destroyQueue, updateQueue) {
    this.destroyQueue = destroyQueue || [];
    this.updateQueue = updateQueue || [];
  }

  build() {
    const buffer = BufferCodec()
      .uint8(OPCode.UPDATE_SPELLS)
      .uint8(this.updateQueue.length);
      
    this.updateQueue.forEach(node => {
      buffer
        .string(node.id)
        .string(node.owner.pId)
        .uint8(node.type)
        .uint8(node.mass)
        .uint8(node.power)
        .float32le(node.position.x)
        .float32le(node.position.y)
        .float32le(node.target.x)
        .float32le(node.target.y)
        .uint8(node.color.r)
        .uint8(node.color.g)
        .uint8(node.color.b);
    });
    
    buffer.uint8(this.destroyQueue.length);
      
    this.destroyQueue.forEach(node => buffer.string(node.id));

    return buffer.result();
  }
  
}

module.exports = UpdateSpells;