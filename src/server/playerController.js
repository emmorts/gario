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
  
  this.target = {x: 0, y: 0};

  if (gameServer) {
    this.pId = uuid.v4().replace(/-/g, '');
  }
}

PlayerController.prototype.setName = function (value) {
  this.name = value;
}

PlayerController.prototype.update = function () {
  let updateNodes = [].concat(this.nodeAdditionQueue);

  if (updateNodes.length > 0 || this.nodeDestroyQueue.length > 0) {
    this.socket.sendPacket(new Packet.UpdateNodes(this.nodeDestroyQueue, updateNodes));
  }

  this.nodeDestroyQueue = []; // Reset destroy queue
  this.nodeAdditionQueue = []; // Reset addition queue
}

module.exports = PlayerController;