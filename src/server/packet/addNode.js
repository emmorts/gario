const BufferCodec = require('buffercodec');
const OPCode = require('../../opCode');

function AddNode(node) {
  this.node = node;
}

module.exports = AddNode;

AddNode.prototype.build = function () {
  return BufferCodec()
    .uint8(OPCode.ADD_NODE)
    .string(this.node.id)
    .uint8(this.node.owner.name.length)
    .string(this.node.owner.name)
    .float32le(this.node.position.x)
    .float32le(this.node.position.y)
    .uint8(this.node.color.r)
    .uint8(this.node.color.g)
    .uint8(this.node.color.b)
    .result();
};