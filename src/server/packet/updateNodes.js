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
      .floatle(node.position.x)
      .floatle(node.position.y);
  });

  return buffer.result();
};
