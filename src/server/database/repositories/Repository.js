class Repository {
  find() {
    throw new Error(`find() must be implemented in ${this.constructor.name}`);
  }

  findAll() {
    throw new Error(`findAll() must be implemented in ${this.constructor.name}`);
  }

  insert() {
    throw new Error(`insert() must be implemented in ${this.constructor.name}`);
  }
}

module.exports = Repository;
