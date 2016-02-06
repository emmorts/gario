export default class EventEmitter {
  constructor() {
    this._eventHandlers = [];
  }
  
  on(name, listener) {
    if (!(name in this._eventHandlers) || !(this._eventHandlers[name] instanceof Array)) {
      this._eventHandlers[name] = [];
    }
    this._eventHandlers[name].push(listener);
  }
  
  _fire(name, options) {
    if (name in this._eventHandlers && this._eventHandlers[name].length > 0) {
      this._eventHandlers[name].forEach(handler => handler(options));
    }
  }
}