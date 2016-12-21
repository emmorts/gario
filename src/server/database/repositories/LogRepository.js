const MongoRepository = require('server/database/repositories/MongoRepository');

class LogRepository extends MongoRepository {
  constructor() {
    super('logs');
  }
}

module.exports = new LogRepository();
