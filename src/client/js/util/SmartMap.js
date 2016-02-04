export default class SmartMap {
  constructor() {
    this._head = null;
    this._tail = null;
    this._position = null;
    this._keys = {};
    this.length = 0;
  }

  get(key) {
    return this._keys[key] ? this._keys[key].v : undefined;
  }

  set(key, value) {
    if (!this._keys[key]) {
      var node = { v: value };

      if (this.length === 0) {
        this._head = this._tail = node;
        this.reset();
      } else {
        node.p = this._tail;
        this._tail.n = node;
        this._tail = node;
      }
      
      this._keys[key] = node;

      this.length++;
    }
  }
  
  delete(key) {
    var v;
    var node = this._keys[key];

    if (node) {
      v = node.v;

      if (node.p) node.p.n = node.n;
      if (node.n) node.n.p = node.p;

      this._keys[key] = null;
      this.length--;
    }

    return v;
  }
  
  forEach(fn, thisArg) {
    var tmp, index = 0;
    if (this.length) {
      while (tmp = this.iterate()) {
        if (thisArg) {
          fn(tmp.v, index).bind(thisArg);
        } else {
          fn(tmp.v, index);
        }
        index++;
      }
      
      this.reset();
    }
  }

  iterate() {
    return this._position = this._position.n;
  }

  reset() {
    this._position = { n: this._head };
  }

  empty() {
    this._keys = {};
    this._head = this._tail = this._position = null;
    this.length = 0;
  };
}