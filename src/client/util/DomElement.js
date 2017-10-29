const Logger = require('client/Logger');

class DomElement {
  constructor(query) {
    this.htmlElement = null;
    this.instance = null;
    this._disabled = false;
    this._visible = true;
    this._eventHandlers = [];

    if (query) {
      this.htmlElement = window.document.querySelector(query);
    }
  }

  get content() {
    if (this.htmlElement) {
      return this.htmlElement.value;
    }

    return null;
  }

  get isDisabled() {
    return this._disabled;
  }

  get isVisible() {
    return this._visible;
  }

  enable() {
    if (this.htmlElement) {
      this._disabled = false;
      this.htmlElement.disabled = false;
    }

    return this;
  }

  disable() {
    if (this.htmlElement) {
      this._disabled = true;
      this.htmlElement.disabled = true;
    }

    return this;
  }

  hide() {
    if (this.htmlElement && this._visible) {
      this._visible = false;
      this.htmlElement.style.display = 'none';
    }

    return this;
  }

  show() {
    if (this.htmlElement && !this._visible) {
      this._visible = true;
      this.htmlElement.style.display = 'block';
    }

    return this;
  }

  on(name, listener) {
    if (!this.htmlElement) {
      Logger.error('Adding an event listener failed due to missing HTML node.');
    } else {
      if (!(name in this._eventHandlers) || !(this._eventHandlers[name] instanceof Array)) {
        this._eventHandlers[name] = [];
      }
      if (!~this._eventHandlers[name].indexOf(listener)) {
        this._eventHandlers[name].push(listener);

        this.htmlElement.addEventListener(name, listener);
      }
    }

    return this;
  }
}

module.exports = DomElement;
