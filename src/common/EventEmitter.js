module.exports = class EventEmitter {
  constructor() {
    this._eventHandlers = {};
  }

  static attach(object) {
    object._eventHandlers = [];
    object.on = on.bind(object);
    object.fire = fire.bind(object);

    function on(name, listener) {
      if (!(name in this._eventHandlers) || !(this._eventHandlers[name] instanceof Array)) {
        this._eventHandlers[name] = [];
      }
      this._eventHandlers[name].push(listener);

      return this;
    }
    
    function fire(name, options) {
      if (name in this._eventHandlers && this._eventHandlers[name].length > 0) {
        this._eventHandlers[name].forEach(handler => handler(options));
      }
    }
  }

};