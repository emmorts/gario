export default interface IRepository {
  find<T>(): Promise<T>;
  findAll<T>(): Promise<T[]>;
  insert<T>(object: T): Promise<void>
}