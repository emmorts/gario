const BufferCodec = require('buffercodec');
const OPCode = require('../../opcode');

function UpdateSpells(destroyQueue, updateQueue) {
  this.destroyQueue = destroyQueue || [];
  this.updateQueue = updateQueue || [];
}

module.exports = UpdateSpells;

UpdateSpells.prototype.build = function () {
  const buffer = BufferCodec()
    .uint8(OPCode.UPDATE_SPELLS)
    .uint8(this.updateQueue.length);
    
  this.updateQueue.forEach(function (node) {
    buffer
      .string(node.id)
      .string(node.ownerId)
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
    
  this.destroyQueue.forEach(function (node) {
    buffer.string(node.id)
  });

  return buffer.result();
};
