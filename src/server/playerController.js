let uuid = require('node-uuid');
let Packet = require('./packet');

function PlayerController(gameServer, socket) {
  this.pId = -1;
  this.gameServer = gameServer;
  this.socket = socket;
  this.cells = [];
  this.name = "";
  this.nodeAdditionQueue = [];
  this.nodeDestroyQueue = [];
  this.visibleNodes = [];

  if (gameServer) {
    this.pId = uuid.v4().replace(/-/g, '');
  }
}

PlayerController.prototype.setName = function (value) {
  this.name = value;
}

PlayerController.prototype.update = function () {
  let updateNodes = []; // Nodes that need to be updated via packet
    
  // Remove nodes from visible nodes if possible
  let d = 0;
  while (d < this.nodeDestroyQueue.length) {
    let index = this.visibleNodes.indexOf(this.nodeDestroyQueue[d]);
    if (index > -1) {
      this.visibleNodes.splice(index, 1);
      d++; // Increment
    } else {
      // Node was never visible anyways
      this.nodeDestroyQueue.splice(d, 1);
    }
  }
    
  this.tickViewBox--;
  // Add nodes to screen
  let nonVisibleNodes = []; // Nodes that are not visible
  for (let i = 0; i < this.nodeAdditionQueue.length; i++) {
    let node = this.nodeAdditionQueue[i];
    this.visibleNodes.push(node);
    updateNodes.push(node);
  }
    
  // Update moving nodes
  for (let i = 0; i < this.visibleNodes.length; i++) {
    let node = this.visibleNodes[i];
    if (node.sendUpdate()) {
      // Sends an update if cell is moving
      updateNodes.push(node);
    }
  }

  // Send packet
  console.log(updateNodes);
  this.socket.sendPacket(new Packet.UpdateNodes(this.nodeDestroyQueue, updateNodes, nonVisibleNodes));

  this.nodeDestroyQueue = []; // Reset destroy queue
  this.nodeAdditionQueue = []; // Reset addition queue
}

module.exports = PlayerController;