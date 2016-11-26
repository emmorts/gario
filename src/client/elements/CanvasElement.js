const Element = require('client/elements/Element');
const DomElement = require('client/util/DomElement');

class CanvasElement extends Element {
  constructor(name) {
    super();

    this._canvasElement = null;
    this._canvasContext = null;

    this
      .bind(name)
      .bindEvents();
  }

  get width() {
    return this._canvasElement.htmlElement.width;
  }

  get height() {
    return this._canvasElement.htmlElement.height;
  }

  get context() {
    return this._canvasContext;
  }

  bind(name) {
    this._canvasElement = new DomElement(name);
    this._canvasContext = this._canvasElement.htmlElement.getContext('2d');

    this._setDefaultSize();

    return this;
  }

  bindEvents() {
    window.addEventListener('resize', this._setDefaultSize.bind(this));

    this._canvasElement.on('contextmenu', event => event.preventDefault());

    return this;
  }

  _setDefaultSize() {
    const defaultWidth = CanvasElement._getDefaultWidth();
    const defaultHeight = CanvasElement._getDefaultHeight();

    this._canvasElement.htmlElement.width = defaultWidth;
    this._canvasElement.htmlElement.height = defaultHeight;

    this.fire('resize', {
      width: defaultWidth,
      height: defaultHeight,
    });
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

module.exports = CanvasElement;
