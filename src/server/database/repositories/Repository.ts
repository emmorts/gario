import { FilterQuery, FindOneOptions, CollectionInsertOneOptions } from "mongodb";

export default abstract class Repository<T> {
  abstract find(query: string | FilterQuery<T>, options?: FindOneOptions): Promise<T>;
  abstract findAll(): Promise<T[]>;
  abstract insert(entity: T, options?: CollectionInsertOneOptions): Promise<void>;
}
