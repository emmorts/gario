module.exports = class EventEmitter {
  constructor() {
    this._eventHandlers = {};
  }

  static attach(object) {
    object._eventHandlers = [];

    object.on = function on(name, listener) {
      if (!(name in this._eventHandlers) || !(this._eventHandlers[name] instanceof Array)) {
        this._eventHandlers[name] = [];
      }
      this._eventHandlers[name].push(listener);

      return this;
    }.bind(object);

    object.fire = function fire(name, options) {
      if (name in this._eventHandlers && this._eventHandlers[name].length > 0) {
        this._eventHandlers[name].forEach(handler => handler(options));
      }
    }.bind(object);
  }

};
