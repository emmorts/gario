export default class SmartMap {
  constructor() {
    this._head = null;
    this._tail = null;
    this._position = null;
    this._keys = {};
    this.length = 0;
  }

  set(key, value) {
    if (!this._keys[key]) {
      var node = { v: value };

      if (this.length === 0) {
        this._head = this._tail = node;
        this.rwd();
      } else {
        node.p = this._tail;
        this._tail.n = node;
        this._tail = node;
      }
      
      this._keys[key] = node;

      this.len++;
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
      this.len--;
    }

    return v;
  }

  get(key) {
    return this._keys[key];
  };

  itr() {
    return this._position = this._position.n;
  };

  rwd() {
    this._position = { n: this._head };
  }

  empty() {
    this._keys = {};
    this._head = this._tail = this._position = null;
    this.length = 0;
  };
}