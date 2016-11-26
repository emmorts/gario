const Element = require('client/elements/Element');
const DomElement = require('client/util/DomElement');

class MapCanvasElement extends Element {
  constructor() {
    super();

    this._canvasElement = null;
    this._canvasContext = null;
    this._targetTick = performance.now();

    this.bind();
  }

  bind() {
    this._canvasElement = new DomElement('.js-map-canvas');
    this._canvasContext = this._canvasElement.htmlElement.getContext('2d');

    this._setDefaultSize();

    this._canvasElement.on('contextmenu', event => event.preventDefault());

    return this;
  }

  _setDefaultSize() {
    const defaultWidth = MapCanvasElement._getDefaultWidth();
    const defaultHeight = MapCanvasElement._getDefaultHeight();

    this._canvasElement.htmlElement.width = defaultWidth;
    this._canvasElement.htmlElement.height = defaultHeight;

    if (this._camera) {
      this._camera.width = defaultWidth;
      this._camera.height = defaultHeight;
    }
  }

  static _getDefaultWidth() {
    return window.innerWidth && document.documentElement.clientWidth
      ? Math.min(window.innerWidth, document.documentElement.clientWidth)
      : window.innerWidth ||
      document.documentElement.clientWidth ||
      document.getElementsByTagName('body')[0].clientWidth;
  }

  static _getDefaultHeight() {
    return window.innerHeight && document.documentElement.clientHeight
      ? Math.min(window.innerHeight, document.documentElement.clientHeight)
      : window.innerHeight ||
      document.documentElement.clientHeight ||
      document.getElementsByTagName('body')[0].clientHeight;
  }
}

module.exports = MapCanvasElement;
