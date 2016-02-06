const server = require('http').createServer();
const WebSocket = require('ws');
const config = require('./config');
const PacketHandler = require('./PacketHandler');
const PlayerController = require('./PlayerController');
const GameMode = require('./gamemodes');
const Model = require('./models');
const Packets = require('./packets');
const Maps = require('./maps');
const WebSocketServer = WebSocket.Server;

function GameServer(server) {
  this.debug = process.env.DEVELOPMENT ? true : false;
  
  this.clients = [];
  this.players = [];
  this.spells = [];

  this.time = Date.now();
  this.startTime = this.time;
  this.tick = 0;
  this.tickMain = 0;
  this.updateRate = 1000 / 60;
  
  this.gameMode = GameMode.get(config.defaultGameMode);
  
  this._socketServerOptions = server
    ? { server: server }
    : { port: config.port, perMessageDeflate: false };
    
}

GameServer.prototype.start = function () {
  this.gameMode.onServerInit(this);

  this.socketServer = new WebSocketServer(this._socketServerOptions);

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
      const nodes = this.players.filter(node => node.ownerId === socket.playerController.pId);
      
      if (nodes.length > 0) {
        this.clients.forEach(function (client) {
          if (client !== socket) {
            client.sendPacket(new Packets.UpdatePlayers(nodes));
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
  const local = Date.now();
  this.tick += (local - this.time);
  this.time = local;

  if (this.tick > 50) {
    this.movementTick();
    this.updateClients();

    this.tick = 0;
  }
}

GameServer.prototype.movementTick = function () {
  this.players.forEach(player => player.calculateNextPosition());
}

GameServer.prototype.addPlayer = function (player) {
  this.players.push(player);

  if (player.owner) {
    player.setColor(player.owner.color);
    player.owner.socket.sendPacket(new Packets.AddPlayer(player));
  }

  player.onAdd();
}

GameServer.prototype.updateClients = function () {
  this.clients.forEach(function (client) {
    if (client && typeof client !== 'undefined') {
      client.playerController.update();
    }
  }, this);
}

GameServer.prototype.onTargetUpdated = function (socket) {
  const node = this.players.find(node => node.owner.id === socket.playerController.pId);
  
  if (node) {
    this.clients.forEach(function (client) {
      if (client !== socket) {
        client.sendPacket(new Packets.UpdatePlayers([], [ node ]));
      }
    }, this);
  }
}

GameServer.prototype.onCast = function (spell) {
  this.spells.push(spell);
  this.clients.forEach(client => client.playerController.spellAdditionQueue.push(spell));
  
  setTimeout(() => {
    this.clients.forEach(client => client.playerController.spellDestroyQueue.push(spell));
    
    const index = this.spells.indexOf(spell);
    if (index !== -1) {
      this.spells.splice(index, 1);
    }
  }, spell.duration);
}

GameServer.prototype.spawnPlayer = function (player) {
  const playerModel = new Model.Player(this, player);
  
  player.target = {
    x: playerModel.position.x,
    y: playerModel.position.y
  };

  player.model = playerModel;
  
  this.addPlayer(playerModel);
}

GameServer.prototype.getRandomColor = function () {
  const rand = Math.floor(Math.random() * 3);
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
  if (this.readyState == WebSocket.OPEN && packet.build) {
    const buffer = packet.build();
    this.send(buffer, { binary: true });
  } else {
    this.readyState = WebSocket.CLOSED;
    this.emit('close');
    this.removeAllListeners();
  }
};

module.exports = GameServer;