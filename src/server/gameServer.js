let server = require('http').createServer();
let WebSocket = require('ws');
let config = require('./config');
let PacketHandler = require('./PacketHandler');
let PlayerController = require('./PlayerController');
let WebSocketServer = WebSocket.Server;
let Packet = require('./packet');

function GameServer(server) {
  this.run = true;
  this.clients = [];
  this.nodes = [];
  this.nodesPlayer = [];
  
  this.time = Date.now();
  this.startTime = this.time;
  this.tick = 0;
  this.tickMain = 0;
  this.updateRate = 1000 / 60;
  this.options = server
    ? { server: server }
    : { port: config.port, perMessageDeflate: false };
}

GameServer.prototype.start = function () {
  this.socketServer = new WebSocketServer(this.options);
  
  setInterval(this.gameLoop.bind(this), this.updateRate);
  
  this.socketServer.on('connection', connectionEstablished.bind(this));
  this.socketServer.on('error', connectionError.bind(this));
  
  function connectionEstablished(socket) {
    console.log("Connection has been established.");
    if (this.clients.length >= config.maxConnections) {
      console.log("Server is full");
      socket.close();
      return;
    }
    
    socket.playerController = new PlayerController(this, socket);
    socket.packetHandler = new PacketHandler(this, socket);
    
    socket.on('message', socket.packetHandler.handleMessage.bind(socket.packetHandler));
    
    socket.on('error', closeConnection.bind(this));
    socket.on('close', closeConnection.bind(this));
    
    this.clients.push(socket);
    
    function closeConnection(error) {
      console.log("Connection closed.");
    }
  }
  
  function connectionError(error) {
    console.log("[Error] Unhandled error code: " + error.code);
    process.exit(1);
  }
}

GameServer.prototype.gameLoop = function () {
  let local = Date.now();
  this.tick += (local - this.time);
  this.time = local;
  
  if (this.tick > 50) {
    if (this.run) {
      setTimeout(this.cellTick, 0);      
      setTimeout(this.spawnTick, 0);
    }
      
    this.tickMain++;
    if (this.tickMain >= 20) {
      setTimeout(this.cellUpdateTick, 0);
      this.tickMain = 0;
    }
    
    this.updateClients();
    
    this.tick = 0;
  }
}

GameServer.prototype.addNode = function (node) {
  this.nodes.push(node);
  
  if (node.owner) {
    node.setColor(node.owner.color);
    node.owner.cells.push(node);
    node.owner.socket.sendPacket(new Packet.AddNode(node));
  }
}

GameServer.prototype.updateClients = function () {
  this.clients.forEach(function (client) {
    if (client && typeof client !== 'undefined') {
      client.playerController.update();
    }
  }, this);
}

WebSocket.prototype.sendPacket = function(packet) {
  function getBuffer(data) {
    let array = new Uint8Array(data.buffer || data);
    let length = data.byteLength || data.length;
    let offset = data.byteOffset || 0;
    let buffer = new Buffer(length);

    for (let i = 0; i < length; i++) {
      buffer[i] = array[offset + i];
    }

    return buffer;
  }
  
  if (this.readyState == WebSocket.OPEN && packet.build) {
    let buffer = packet.build();
    this.send(getBuffer(buffer), {binary: true});
  } else {
    this.readyState = WebSocket.CLOSED;
    this.emit('close');
    this.removeAllListeners();
  }
};

module.exports = GameServer;