import { IFactory } from 'server/factories/IFactory';

export default class GenericModelFactory<T extends Record<keyof T, new (...args: any) => any>> implements IFactory<T> {
  constructor(protected objectCollection: T) {}

  instantiate<K extends keyof T>(type: K, ...params: ConstructorParameters<T[K]>): InstanceType<T[K]>;
  instantiate(type: keyof T, ...params: unknown[]): InstanceType<T[keyof T]>;
  instantiate<K extends keyof T>(type: K, ...params: ConstructorParameters<T[K]>): InstanceType<T[K]> {
    if (!this.objectCollection) {
      throw new Error(`No registered entities found.`);
    }

    if (!(type in this.objectCollection)) {
      throw new Error(`Type '${type}' is not registered in provided collection.`);
    }

    const ModelRef = this.objectCollection[type] as new (...params: ConstructorParameters<T[K]>) => InstanceType<T[K]>;

    return new ModelRef(...params);
  }
}
