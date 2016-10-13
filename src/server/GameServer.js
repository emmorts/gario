const server = require('http').createServer();
const WebSocket = require('ws');
const config = require('server/config');
const PacketHandler = require('server/PacketHandler');
const PlayerController = require('server/PlayerController');
const Factory = require('server/Factory');
const GameMode = require('server/gamemodes');
const Model = require('server/models');
// const Packets = require('server/packets');
const Maps = require('server/maps');
const OPCode = require('opCode');
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

  this.gameMode = GameMode.get.call(this, config.defaultGameMode);

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

    socket.on('message', message => {
      socket.packetHandler.handleMessage.call(socket.packetHandler, message);
    });

    socket.on('error', closeConnection.bind(this));
    socket.on('close', closeConnection.bind(this));

    this.clients.push(socket);

    function closeConnection(error) {
      const indexOfPlayer = this.players.findIndex(node => node.ownerId === socket.playerController.pId);

      if (indexOfPlayer !== -1) {
        this.players.splice(indexOfPlayer, 1);

        this.clients = this.clients.filter(client => client !== socket);
        this.clients.forEach(client => client.playerController.playerDestroyQueue.push(this.players[indexOfPlayer]));
      }

      console.log("Connection closed.");
    }
  }

  function connectionError(error) {
    console.log("[Error] Unhandled error code: " + error.code);
    process.exit(1);
  }
};

GameServer.prototype.gameLoop = function () {
  const local = Date.now();
  this.tick += (local - this.time);
  this.time = local;

  if (this.tick > 50) {
    this.movementTick();
    this.updateClients();

    this.tick = 0;
  }
};

GameServer.prototype.movementTick = function () {
  this.players.forEach(player => player.calculateNextPosition());
};

GameServer.prototype.addPlayer = function (player) {
  if (player.owner) {
    player.setColor(player.owner.color);
    player.owner.send(OPCode.ADD_PLAYER, player);

    this.clients.forEach(function (client) {
      if (client !== player.owner.socket) {
        client.playerController.playerAdditionQueue.push(player);
      }
    }, this);

    player.owner.playerAdditionQueue = player.owner.playerAdditionQueue.concat(this.players);
  }

  this.players.push(player);

  player.onAdd();
};

GameServer.prototype.updateClients = function () {
  this.clients.forEach(function (client) {
    if (client && typeof client !== 'undefined') {
      client.playerController.update();
    }
  }, this);
};

GameServer.prototype.onTargetUpdated = function (socket) {
  const node = this.players.find(node => node.owner.pId === socket.playerController.pId);

  if (node) {
    this.clients.forEach(function (client) {
      if (client !== socket) {
        client.playerController.playerAdditionQueue.push(node);
      }
    }, this);
  }
};

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
};

GameServer.prototype.spawnPlayer = function (player) {
  const playerModel = Factory.instantiate(
    OPCode.TYPE_MODEL,
    OPCode.MODEL_PLAYER,
    this,
    player
  );

  player.target = {
    x: playerModel.position.x,
    y: playerModel.position.y
  };

  player.model = playerModel;

  this.gameMode.onPlayerSpawn(player);

  this.addPlayer(playerModel);
};

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
};

module.exports = GameServer;