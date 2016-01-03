const OPCode = require('../../opCode');

function AddNode(item) {
    this.item = item;
}

module.exports = AddNode;

AddNode.prototype.build = function() {
    var buffer = new ArrayBuffer(5);
    var view = new DataView(buffer);

    view.setUint8(0, OPCode.ADD_NODE);
    view.setUint32(1, this.item.nodeId, true);

    return buffer;
};