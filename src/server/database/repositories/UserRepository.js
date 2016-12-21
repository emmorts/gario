const MongoRepository = require('server/database/repositories/MongoRepository');

class UserRepository extends MongoRepository {
  constructor() {
    super('users');
  }
}

module.exports = new UserRepository();
