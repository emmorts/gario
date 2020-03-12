import { EventEmitter } from "common/EventEmitter";
import MongoConnector from "server/database/connectors/MongoConnector";
import Repository from "server/database/repositories/Repository";
import { Collection, FilterQuery, FindOneOptions, CollectionInsertOneOptions } from "mongodb";

type MongoRepositoryEvent = 'connected';

export default class MongoRepository<T> extends Repository<T> {
  public listener = new EventEmitter<MongoRepositoryEvent>();

  private _connector = MongoConnector;
  private _collection: Collection<T> = null;
  private _connected = false;

  constructor(private collectionName: string) {
    super();

    this._enqueueDatabase(() => {
      this._collection = this._connector.database.collection<T>(this.collectionName);
      this._connected = true;

      this.listener.fire('connected');
    });
  }

  get isConnected() {
    return this._connected;
  }

  async find(query: FilterQuery<T>, options?: FindOneOptions): Promise<T> {
    return await this._ensureConnection<T>(async () => {
      return await this._collection.findOne(query, options);
    });
  }

  async findAll(query: FilterQuery<T> = null, options: FindOneOptions = null): Promise<T[]> {
    return await this._ensureConnection<T[]>(async () => await this._collection.find(query, options).toArray());
  }

  async insert(entity: T, options?: CollectionInsertOneOptions): Promise<void> {
    return await this._ensureConnection<void>(async () => {
      await this._collection.insertOne(entity as any, options);
    });
  }

  _enqueueDatabase(operation: () => void) {
    if (this._connector.isConnected) {
      operation();
    } else {
      this._connector.listener.once('connected', operation);
    }
  }

  async _ensureConnection<T>(operation: () => Promise<T>): Promise<T> {
    if (this.isConnected) {
      return await operation();
    } else {
      this.listener.once('connected', operation);
    }
  }
}
