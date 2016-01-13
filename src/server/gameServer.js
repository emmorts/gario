let server = require('http').createServer();
let WebSocket = require('ws');
let config = require('./config');
let PacketHandler = require('./PacketHandler');
let PlayerController = require('./PlayerController');
let GameMode = require('./gamemodes');
let Model = require('./models');
let WebSocketServer = WebSocket.Server;
let Packet = require('./packet');

function GameServer(server) {
  this.run = true;
  this.debug = process.env.DEVELOPMENT ? true : false;
  this.clients = [];
  
  this.nodes = [];
  this.nodesPlayer = [];
  this.movingNodes = [];

  this.time = Date.now();
  this.startTime = this.time;
  this.tick = 0;
  this.tickMain = 0;
  this.updateRate = 1000 / 60;
  this.options = server
    ? { server: server }
    : { port: config.port, perMessageDeflate: false };
    
  this.gameMode = GameMode.get(config.defaultGameMode);
}

GameServer.prototype.start = function () {
  this.gameMode.onServerInit(this);

  this.socketServer = new WebSocketServer(this.options);

  setInterval(this.gameLoop.bind(this), this.updateRate);

  this.socketServer.on('connection', connectionEstablished.bind(this));
  this.socketServer.on('error', connectionError.bind(this));

  function connectionEstablished(socket) {
    console.log("Client has connected.");
    if (this.clients.length >= config.maxConnections) {
      console.log("Server is full");
      socket.close();
      return;
    }

    socket.playerController = new PlayerController(this, socket);
    socket.packetHandler = new PacketHandler(this, socket);

    socket.on('message', function (message) {
      socket.packetHandler.handleMessage.call(socket.packetHandler, message);
    }.bind(this));

    socket.on('error', closeConnection.bind(this));
    socket.on('close', closeConnection.bind(this));

    this.clients.push(socket);

    function closeConnection(error) {
      const nodes = this.nodes.filter(function (node) {
        return node.ownerId === socket.playerController.pId;
      }, this);
      
      if (nodes.length > 0) {
        this.clients.forEach(function (client) {
          if (client !== socket) {
            client.sendPacket(new Packet.UpdateNodes(nodes));
          }
        }, this);
      }
      
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
      setTimeout(this.movementTick.bind(this), 0);
    }

    this.tickMain++;
    if (this.tickMain >= 20) {
      this.tickMain = 0;
    }

    this.updateClients();

    this.tick = 0;
  }
}

GameServer.prototype.movementTick = function () {
  this.updateMovementEngine();
}

GameServer.prototype.addNode = function (node) {
  this.nodes.push(node);

  if (node.owner) {
    node.setColor(node.owner.color);
    node.owner.socket.sendPacket(new Packet.AddNode(node));
  }

  node.onAdd(this);

  this.clients.forEach(function (client) {
    let controller = client.playerController;
    if (controller && '_socket' in controller.socket) {
      controller.nodeAdditionQueue.push(node);
    }
  }, this);
}

GameServer.prototype.updateClients = function () {
  this.clients.forEach(function (client) {
    if (client && typeof client !== 'undefined') {
      client.playerController.update();
    }
  }, this);
}

GameServer.prototype.updateMovementEngine = function () {
  this.movingNodes = [];
  
  // this.nodes.forEach(function (node) {
  //   const currentPosX = node.position.x;
  //   const currentPosY = node.position.y;
    
  //   node.calculateNextPosition();
    
  //   const diffX = Math.abs(currentPosX - node.position.x);
  //   const diffY = Math.abs(currentPosY - node.position.y);
    
  //   if (diffX + diffY > 1) {
  //     this.movingNodes.push(node);
  //   }
  // }, this);
  
  // this.clients.forEach(function (client) {
  //   client.playerController.nodeAdditionQueue = client.playerController.nodeAdditionQueue.concat(this.movingNodes); 
  // }, this);
}

GameServer.prototype.onTargetUpdated = function (socket) {
  const node = this.nodes.find(function (node) {
    return node.ownerId === socket.playerController.pId;
  });
  if (node) {
    this.clients.forEach(function (client) {
      if (client !== socket) {
        client.sendPacket(new Packet.UpdateNodes([], [ node ]));
      }
    }, this);
  }
}

GameServer.prototype.spawnPlayer = function (player) {
  var playerModel = new Model.Player(this, player);
  
  player.target = {
    x: playerModel.position.x,
    y: playerModel.position.y
  };

  this.addNode(playerModel);
}

GameServer.prototype.getRandomColor = function () {
  var rand = Math.floor(Math.random() * 3);
  if (rand === 0) {
    return {
	     r: 255,
	     b: Math.floor(Math.random() * 255),
	     g: 0
    };
  } else if (rand === 1) {
    return {
	     r: 0,
	     b: 255,
	     g: Math.floor(Math.random() * 255)
    };
  } else {
    return {
	     r: Math.floor(Math.random() * 255),
	     b: 0,
	     g: 255
    };
  }
}

WebSocket.prototype.sendPacket = function (packet) {
  // function getBuffer(data) {
  //   let array = new Uint8Array(data.buffer || data);
  //   let length = data.byteLength || data.length;
  //   let offset = data.byteOffset || 0;
  //   let buffer = new Buffer(length);

  //   for (let i = 0; i < length; i++) {
  //     buffer[i] = array[offset + i];
  //   }

  //   return buffer;
  // }
  if (process.env.DEVELOPMENT) {
    console.log(packet);
  }

  if (this.readyState == WebSocket.OPEN && packet.build) {
    let buffer = packet.build();
    this.send(buffer, { binary: true });
  } else {
    this.readyState = WebSocket.CLOSED;
    this.emit('close');
    this.removeAllListeners();
  }
};

module.exports = GameServer;