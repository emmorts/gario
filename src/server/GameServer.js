const server = require('http').createServer();
const WebSocket = require('ws');
const present = require('present');
const config = require('server/config');
const PacketHandler = require('server/PacketHandler');
const PlayerController = require('server/PlayerController');
const Factory = require('server/Factory');
const GameMode = require('server/gamemodes');
const Maps = require('server/maps');
const OPCode = require('opCode');
const WebSocketServer = WebSocket.Server;

class GameServer {
  constructor(server) {
    this.debug = process.env.DEVELOPMENT ? true : false;

    this.sockets = [];
    this.players = [];
    this.spells = [];

    this.time = present();
    this.startTime = this.time;
    this.tick = 0;
    this.updateRate = 1000 / 60;

    this.gameMode = GameMode.get.call(this, config.defaultGameMode);

    this._socketServerOptions = server
      ? { server: server }
      : { port: config.port, perMessageDeflate: false };
  }

  start() {
    this._setupSocket();

    this.gameMode.onServerInit(this);

    setInterval(this.gameLoop.bind(this), this.updateRate);
  }

  gameLoop() {
    const current = present();

    this.tick += (current - this.time);
    this.time = current;

    if (this.tick > 50) {
      this.movementTick();
      this.updateClients();

      this.tick = 0;
    }
  }

  movementTick() {
    this.players.forEach(player => player.calculateNextPosition());
  }

  addPlayer(player) {
    if (player.owner) {
      player.setColor(player.owner.color);
      player.owner.send(OPCode.ADD_PLAYER, player);

      this.sockets.forEach(function (client) {
        if (client !== player.owner.socket) {
          client.playerController.playerAdditionQueue.push(player);
        }
      }, this);

      player.owner.playerAdditionQueue = player.owner.playerAdditionQueue.concat(this.players);
    }

    this.players.push(player);

    player.onAdd();
  }

  updateClients() {
    this.sockets.forEach(function (client) {
      if (client && typeof client !== 'undefined') {
        client.playerController.update();
      }
    }, this);
  };

  onTargetUpdated(socket) {
    const node = this.players.find(node => node.owner.pId === socket.playerController.pId);

    if (node) {
      this.sockets.forEach(function (client) {
        if (client !== socket) {
          client.playerController.playerAdditionQueue.push(node);
        }
      }, this);
    }
  };

  onCast(spell) {
    this.spells.push(spell);
    this.sockets.forEach(client => client.playerController.spellAdditionQueue.push(spell));

    setTimeout(() => {
      this.sockets.forEach(client => client.playerController.spellDestroyQueue.push(spell));

      const index = this.spells.indexOf(spell);
      if (index !== -1) {
        this.spells.splice(index, 1);
      }
    }, spell.duration);
  };

  spawnPlayer(player) {
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

  _setupSocket() {
    this.socketServer = new WebSocketServer(this._socketServerOptions);

    this.socketServer.on('connection', this._onConnectionEstablished.bind(this));
    this.socketServer.on('error', this._onConnectionError.bind(this));
  }

  _closeConnection() {
    const indexOfPlayer = this.players.findIndex(node => node.ownerId === socket.playerController.pId);

    if (indexOfPlayer !== -1) {
      this.sockets = this.sockets.filter(client => client !== socket);
      this.sockets.forEach(client => client.playerController.playerDestroyQueue.push(this.players[indexOfPlayer]));

      this.players.splice(indexOfPlayer, 1);
    }

    console.log("Connection closed.");
  }

  _onConnectionEstablished(socket) {
    console.log("Client has connected.");

    if (this.sockets.length < config.maxConnections) {
      socket.playerController = new PlayerController(this, socket);
      socket.packetHandler = new PacketHandler(this, socket);

      socket.on('message', message => {
        socket.packetHandler.handleMessage.call(socket.packetHandler, message);
      });

      socket.on('error', this._closeConnection.bind(this));
      socket.on('close', this._closeConnection.bind(this));

      this.sockets.push(socket);
    } else {
      console.log("Server is full");

      socket.close();
    }
  }

  _onConnectionError(error) {
      console.log(`[Error] Unhandled error code: ${error.code}`);
      process.exit(1);
  }
}

module.exports = GameServer;