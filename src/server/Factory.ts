import Logger from "server/Logger";
import Factories from "server/factories";
import { GameObjectType } from "common/gameobjects/GameObjectType";
import GameObject from 'common/GameObject';

export default class Factory {


  static instantiate<T extends GameObject>(type: GameObjectType, ...properties: any[]): T {
    if (Factories) {
      const FactoryRef = Factories[type];

      if (!FactoryRef) {
        Logger.error(`Factory for '${GameObjectType[type]}' was not found.`);
      } else {
        return new FactoryRef(...properties) as T;
      }
    }

    return null;
  }

  // static instantiate(classType: number, ...properties: any[]) {
  //   if (Factories) {
  //     const factory = Factories[classType];

  //     if (!factory) {
  //       Logger.error(`Factory for '${OperationCode[classType]}' was not found.`);
  //     } else {
  //       return factory.instantiate.apply(this, properties);
  //     }
  //   }

  //   return null;
  // }

}

