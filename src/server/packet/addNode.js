const concentrate = require('concentrate');
const OPCode = require('../../opCode');

function AddNode(node) {
  this.node = node;
}

module.exports = AddNode;

AddNode.prototype.build = function () {
  return concentrate()
    .uint8(OPCode.ADD_NODE)
    .string(this.node.id)
    .uint8(this.node.owner.name.length)
    .string(this.node.owner.name)
    .floatle(this.node.position.x)
    .floatle(this.node.position.y)
    .uint8(this.node.color.r)
    .uint8(this.node.color.g)
    .uint8(this.node.color.b)
    .result();
};