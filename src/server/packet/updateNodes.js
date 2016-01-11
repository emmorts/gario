const concentrate = require('concentrate');
const OPCode = require('../../opcode');

function UpdateNodes(destroyQueue, nodes, nonVisibleNodes) {
  this.destroyQueue = destroyQueue;
  this.nodes = nodes;
}

module.exports = UpdateNodes;

UpdateNodes.prototype.build = function () {
  let buffer = concentrate()
    .uint8(OPCode.UPDATE_NODES)
    .uint8(this.nodes.length);
    
  this.nodes.forEach(function (node) {
    buffer
      .string(node.id)
      .uint8(node.owner.name.length)
      .string(node.owner.name)
      .floatle(node.position.x)
      .floatle(node.position.y)
      .floatle(node.owner.target.x)
      .floatle(node.owner.target.y)
      .uint8(node.color.r)
      .uint8(node.color.g)
      .uint8(node.color.b);
  });

  return buffer.result();
};
