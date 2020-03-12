import ModelFactory from "server/factories/ModelFactory";
import SpellFactory from "server/factories/SpellFactory";
import { GameObjectType } from 'common/gameobjects/GameObjectType';
import { IFactory } from 'server/factories/IFactory';

export default {};

// export default {
//   [GameObjectType.Model]: ModelFactory,
//   [GameObjectType.Spell]: SpellFactory
// } as { [key in GameObjectType]?: { new(...properties: any[]): IFactory } };