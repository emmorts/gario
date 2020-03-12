import { v4 as uuid } from 'uuid';
import { OperationCode } from 'common/OperationCode';
import Logger from 'server/Logger';
import { Socket } from 'server/Socket';
import GameServer from 'server/GameServer';
import Player from 'server/models/Player';
import Point from 'common/structures/Point';
import { SpellType } from 'common/gameobjects/spells/SpellType';
import Spell from 'common/gameobjects/spells/Spell';
import { TCastSpellSchema } from 'common/schemas/CastSpell';
import ModelFactory from './factories/ModelFactory';
import { ModelType } from 'common/gameobjects/models/ModelType';
import SpellFactory from './factories/SpellFactory';

export default class PlayerController {

  #playerId: string = uuid().replace(/-/g, '');
  #gameServer: GameServer;
  #playerModel: Player;
  #socket: Socket;
  #spellsOnCooldown: { [key in SpellType]?: Spell } = {};
  #playerAdditionQueue: any[] = [];
  #playerDestroyQueue: any[] = [];
  #spellAdditionQueue: any[] = [];
  #spellDestroyQueue: any[] = [];

  constructor(gameServer: GameServer, socket: Socket) {
    if (!gameServer) {
      throw new Error(`Game server not provided to PlayerController`);
    }

    this.#gameServer = gameServer;
    this.#socket = socket;
  }

  get packetHandler() {
    if (this.#socket) {
      return this.#socket.packetHandler;
    }

    Logger.info(`Player '${this.#playerId}' does not have an attached socket.`);

    return null;
  }
  
  get socket() {
    return this.#socket;
  }

  get playerId() {
    return this.#playerId;
  }

  get playerModel() {
    return this.#playerModel;
  }

  get playerAdditionQueue() {
    return this.#playerAdditionQueue;
  }

  get playerDestroyQueue() {
    return this.#playerDestroyQueue;
  }

  get spellAdditionQueue() {
    return this.#spellAdditionQueue;
  }

  get spellDestroyQueue() {
    return this.#spellDestroyQueue;
  }

  setTarget(target: Point) {
    if (this.#playerModel && target) {
      Logger.trace(`Player '${this.#playerModel.name}' moved to (${target.x}, ${target.y}).`);

      this.#playerModel.setTarget(target);

      this.#gameServer.onTargetUpdated(this);
    }
  }

  spawn(name: string) {
    this.#playerModel = ModelFactory.instantiate(ModelType.Player, name);
    // this.#playerModel = Factory.instantiate(
    //   OperationCode.TYPE_MODEL,
    //   OperationCode.MODEL_PLAYER,
    //   this.#gameServer,
    //   this
    // );

    // this.#playerModel.name = name;

    this.#gameServer.onPlayerSpawn(this);
  }

  cast(options: TCastSpellSchema) {
    if (!(options.type in this.#spellsOnCooldown)) {
      const spell = SpellFactory.instantiate(options.type as number);
      // const spell = Factory.instantiate(
      //   OperationCode.TYPE_SPELL,
      //   options.type,
      //   this.#gameServer,
      //   this,
      //   {
      //     position: options.playerPosition,
      //     target: options.target,
      //   }
      // );

      if (spell) {
        this.#spellsOnCooldown[options.type] = spell;

        setTimeout(() => delete this.#spellsOnCooldown[options.type], spell.cooldown);

        this.#gameServer.onCast(spell);
      }
    }
  }

  update() {
    this.updatePlayers();
    this.updateSpells();
  }

  private updatePlayers() {
    if (this.#playerAdditionQueue.length || this.#playerDestroyQueue.length) {
      this.packetHandler.send(OperationCode.UPDATE_PLAYERS, {
        updatedPlayers: this.#playerAdditionQueue,
        destroyedPlayers: this.#playerDestroyQueue,
      });
    }

    this.#playerDestroyQueue.splice(0, this.#playerDestroyQueue.length);
    this.#playerAdditionQueue.splice(0, this.#playerAdditionQueue.length);
  }

  private updateSpells() {
    if (this.#spellAdditionQueue.length || this.#spellDestroyQueue.length) {
      this.packetHandler.send(OperationCode.UPDATE_SPELLS, {
        updatedSpells: this.#spellAdditionQueue,
        destroyedSpells: this.#spellDestroyQueue,
      });
    }

    this.#spellAdditionQueue.splice(0, this.#spellAdditionQueue.length);
    this.#spellDestroyQueue.splice(0, this.#spellDestroyQueue.length);
  }
}
