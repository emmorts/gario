export default class DomElement {
  constructor(query, elementClass) {
    this.htmlElement = null;
    this.instance = null;
    this._eventHandlers = [];
    
    if (query) {
      this.htmlElement = window.document.querySelector(query);
      
      if (this.htmlElement && elementClass) {
        this.instance = new elementClass(this.htmlElement);
      }
    }
  }
  
  on(name, listener) {
    if (!(name in this._eventHandlers) || !(this._eventHandlers[name] instanceof Array)) {
      this._eventHandlers[name] = [];
    }
    if (!~this._eventHandlers[name].indexOf(listener)) {
      this._eventHandlers[name].push(listener);
      
      this.htmlElement.addEventListener(name, listener);
    }
    
    return this;
  }
}