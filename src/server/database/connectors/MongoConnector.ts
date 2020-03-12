import { EventEmitter } from "common/EventEmitter";
import { MongoClient, Db } from "mongodb";
import { DatabaseConfiguration } from "server/config/configuration";
import config from "server/config/index";

type MongoConnectorEvent = 'connected';

class MongoConnector {
  public listener = new EventEmitter<MongoConnectorEvent>();
  public client: MongoClient = null;
  public database: Db = null;
  
  private _connected: boolean = false;

  constructor(private _databaseConfig: DatabaseConfiguration) {
    this._connect(this._databaseConfig);
  }

  get isConnected() {
    return this._connected;
  }

  _connect(databaseConfig: DatabaseConfiguration) {
    MongoClient.connect(databaseConfig.host, { useUnifiedTopology: true }, (err, client) => {
      if (!err) {
        this._connected = true;
        this.client = client;
        this.database = client.db(databaseConfig.database);

        this.listener.fire('connected');
      } else {
        throw new Error(`Database could not be initialized: ${err}.`);
      }
    });
  }
}

export default (new MongoConnector(config.database));
