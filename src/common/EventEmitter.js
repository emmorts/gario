module.exports = class EventEmitter {
  constructor() {
    this._eventHandlers = [];
  }

  static attach(object) {
    object._eventHandlers = [];

    object.on = function on(name, listener) {
      if (!(name in this._eventHandlers) || !(this._eventHandlers[name] instanceof Array)) {
        this._eventHandlers[name] = [];
      }
      this._eventHandlers[name].push({
        recurrent: true,
        proxy: listener,
      });

      return this;
    }.bind(object);

    object.once = function once(name, listener) {
      if (!(name in this._eventHandlers) || !(this._eventHandlers[name] instanceof Array)) {
        this._eventHandlers[name] = [];
      }
      this._eventHandlers[name].push({
        recurrent: false,
        proxy: listener,
      });

      return this;
    }.bind(object);

    object.fire = function fire(name, options) {
      if (name in this._eventHandlers && this._eventHandlers[name].length) {
        const handlers = this._eventHandlers[name];

        for (let i = handlers.length - 1; i >= 0; i--) {
          handlers[i].proxy(options);

          if (!handlers[i].recurrent) {
            handlers.splice(i, 1);
          }
        }
      }
    }.bind(object);
  }

};
