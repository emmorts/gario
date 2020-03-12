import MongoRepository from "server/database/repositories/MongoRepository"
import Log from "server/database/models/Log";

class LogRepository extends MongoRepository<Log> {
  constructor() {
    super("logs");
  }
}

export default (new LogRepository());
