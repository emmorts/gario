const server = require('http').createServer();
const WebSocket = require('ws');
const present = require('present');
const config = require('server/config');
const PacketHandler = require('server/PacketHandler');
const PlayerController = require('server/PlayerController');
const Factory = require('server/Factory');
const GameMode = require('server/gamemodes');
const Maps = require('server/maps');
const OPCode = require('common/opCode');
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
    
    this.movementTick();
    this.updateClients();
    this.checkForCollisions();

    if (this.tick > 30) {

      this.tick = 0;
    }
  }

  movementTick() {
    this.players.forEach(player => player.model.update());
    this.spells.forEach(spell => spell.update());
  }

  updateClients() {
    this.players.forEach(playerController => playerController.update());
  };

  checkForCollisions() {
    this.spells.forEach((spell, spellIndex) => {
      this.players.forEach(player => {
        if (spell.ownerId !== player.pId && this._didCollide(player.model, spell)) {
          this.players.forEach(playerController => {
            playerController.packetHandler.send(OPCode.COLLISION, {
              actorId: player.model.id,
              colliderId: spell.id
            });
          });

          spell.onCollision(player.model);
          
          this.spells.splice(spellIndex, 1);
        }
      });
    });
  }

  onTargetUpdated(playerController) {
    this.players.forEach(function (player) {
      if (player !== playerController) {
        player.playerAdditionQueue.push(playerController.model);
      }
    }, this);
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

  onPlayerSpawn(playerController) {
    this.gameMode.onPlayerSpawn(playerController);

    playerController.packetHandler.send(OPCode.ADD_PLAYER, playerController.model);

    this.sockets.forEach(function (client) {
      if (client !== playerController.socket) {
        client.playerController.playerAdditionQueue.push(playerController.model);
      }
    }, this);

    const playerModelList = this.players.map(player => player.model);
    playerController.playerAdditionQueue = playerController.playerAdditionQueue.concat(playerModelList);

    this.players.push(playerController);
  };

  _didCollide(actor, collider) {
    const distanceX = actor.position.x - collider.position.x;
    const distanceY = actor.position.y - collider.position.y;
    const distance = distanceX * distanceX + distanceY * distanceY;
    const hitBox = Math.pow(collider.radius + actor.radius, 2);

    return distance <= hitBox;
  }

  _setupSocket() {
    this.socketServer = new WebSocketServer(this._socketServerOptions);

    this.socketServer.on('connection', this._onConnectionEstablished.bind(this));
    this.socketServer.on('error', this._onConnectionError.bind(this));
  }

  _closeConnection(socket) {
    const indexOfPlayer = this.players.findIndex(node => node.pId === socket.playerController.pId);

    if (indexOfPlayer !== -1) {
      const playerModel = this.players[indexOfPlayer].model;
      
      this.sockets = this.sockets.filter(client => client !== socket);
      this.sockets.forEach(client => client.playerController.playerDestroyQueue.push(playerModel));

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

      socket.on('error', this._closeConnection.bind(this, socket));
      socket.on('close', this._closeConnection.bind(this, socket));

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