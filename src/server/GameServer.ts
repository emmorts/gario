import * as ws from 'ws';
import { Server } from 'http';
import { present } from 'common/utils/TimeUtils';
import config from 'server/config';
import PacketHandler from 'server/PacketHandler';
import PlayerController from 'server/PlayerController';
import GameModes from 'server/gamemodes';
import { OperationCode } from 'common/OperationCode';
import Logger from 'server/Logger';
import { Socket } from 'server/Socket';
import GameMode from 'server/gamemodes/GameMode';
import Spell from 'common/gameobjects/spells/Spell';
import GameObject from 'common/GameObject';

const WebSocketServer = ws.Server;

export default class GameServer {
  // General configuration
  #debug = process.env.DEVELOPMENT;
  #socketServer: ws.Server;
  #socketServerOptions: ws.ServerOptions;

  // Game objects
  #gameMode: GameMode = new GameModes[config.defaultGameMode]();
  #sockets: Socket[] = [];
  #players: PlayerController[] = [];
  #spells: Spell[] = [];

  // Game loop configuration
  #lastUpdate: number = present();
  #updateRate: number = 1000 / 60;

  constructor(server: Server) {
    this.#socketServerOptions = server && !config.separateSocketServer
      ? { server }
      : { port: config.wsPort, perMessageDeflate: false };
  }

  start() {
    this._setupSocket();

    this.#gameMode.onServerInit();

    setInterval(this.gameLoop.bind(this), this.#updateRate);
  }

  gameLoop() {
    const current = present();
    const deltaT = current - this.#lastUpdate;

    this.#lastUpdate = current;

    this.movementTick(deltaT);
    this.checkForCollisions();
    this.updateClients();
  }

  movementTick(deltaT: number) {
    this.#players.forEach((player) => {
      if (this.#gameMode.map) {
        this.#gameMode.map.applyEffects(player.playerModel, deltaT);
      }

      player.playerModel.update(deltaT);
    });

    this.#spells.forEach(spell => spell.update(deltaT));
  }

  updateClients() {
    this.#players.forEach(playerController => playerController.update());
  }

  checkForCollisions() {
    this.#spells.forEach((spell, spellIndex) => {
      this.#players.forEach((player) => {
        if (spell.ownerId !== player.playerId && GameServer._didCollide(player.playerModel, spell)) {
          this.#players.forEach((playerController) => {
            playerController.packetHandler.send(OperationCode.COLLISION, {
              actorId: player.playerModel.id,
              colliderId: spell.id,
            });
          });

          spell.onCollision(player.playerModel);

          this.#spells.splice(spellIndex, 1);
        }
      });
    });
  }

  onTargetUpdated(playerController: PlayerController) {
    this.#players.forEach((player) => {
      if (player !== playerController) {
        player.playerAdditionQueue.push(playerController.playerModel);
      }
    }, this);
  }

  onCast(spell: Spell) {
    this.#spells.push(spell);
    this.#sockets.forEach(client => client.playerController.spellAdditionQueue.push(spell));

    setTimeout(() => {
      this.#sockets.forEach(client => client.playerController.spellDestroyQueue.push(spell));

      const index = this.#spells.indexOf(spell);
      if (index !== -1) {
        this.#spells.splice(index, 1);
      }
    }, spell.duration);
  }

  onPlayerSpawn(playerController: PlayerController) {
    this.#gameMode.onPlayerSpawn(playerController.playerModel);

    playerController.packetHandler.send(OperationCode.ADD_PLAYER, playerController.playerModel);
    playerController.packetHandler.send(OperationCode.INITIALIZE_MAP, this.#gameMode.map);

    this.#sockets.forEach((client) => {
      if (client !== playerController.socket) {
        client.playerController.playerAdditionQueue.push(playerController.playerModel);
      }
    }, this);

    const playerModelList = this.#players.map(player => player.playerModel);

    playerController.playerAdditionQueue.push(...playerModelList);

    this.#players.push(playerController);
  }

  static _didCollide(actor: GameObject, collider: Spell) {
    const distanceX = actor.position.x - collider.position.x;
    const distanceY = actor.position.y - collider.position.y;
    const distance = (distanceX * distanceX) + (distanceY * distanceY);
    const hitBox = Math.pow(collider.radius + actor.radius, 2);

    return distance <= hitBox;
  }

  _setupSocket() {
    this.#socketServer = new WebSocketServer(this.#socketServerOptions);

    this.#socketServer.on('connection', this._onConnectionEstablished.bind(this));
    this.#socketServer.on('error', this._onConnectionError.bind(this));
  }

  _closeConnection(socket: Socket) {
    const indexOfPlayer = this.#players.findIndex(node => node.playerId === socket.playerController.playerId);

    if (indexOfPlayer !== -1) {
      const playerModel = this.#players[indexOfPlayer].playerModel;

      this.#sockets = this.#sockets.filter(client => client !== socket);
      this.#sockets.forEach(client => client.playerController.playerDestroyQueue.push(playerModel));

      this.#players.splice(indexOfPlayer, 1);
    }

    Logger.info('Connection closed.');
  }

  _onConnectionEstablished(socket: Socket) {
    Logger.info('Client has connected.');

    // WebSocket.send();

    if (this.#sockets.length < config.maxConnections) {
      socket.playerController = new PlayerController(this, socket);
      socket.packetHandler = new PacketHandler(socket);

      socket.on('message', (message) => {
        socket.packetHandler.handleMessage.call(socket.packetHandler, message);
      });

      socket.on('error', this._closeConnection.bind(this, socket));
      socket.on('close', this._closeConnection.bind(this, socket));

      this.#sockets.push(socket);
    } else {
      Logger.info('Server is full');

      socket.close();
    }
  }

  _onConnectionError(error: Error) {
    Logger.error(`Unhandled error code: ${error}.`);

    process.exit(1);
  }
}
