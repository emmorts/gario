import MongoRepository from "server/database/repositories/MongoRepository";
import User from "server/database/models/User";

class UserRepository extends MongoRepository<User> {
  constructor() {
    super("users");
  }
}

export default (new UserRepository());