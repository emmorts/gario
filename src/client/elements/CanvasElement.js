const Element = require('client/elements/Element');
const DomElement = require('client/util/DomElement');
const KeyCode = require('client/util/KeyCode');
const GameRenderer = require('client/GameRenderer');
const OPCode = require('common/opCode');

class CanvasElement extends Element {
  constructor() {
    super();

    this._renderer = null;
    this._canvasElement = null;
    this._canvasContext = null;
    this._scrollOffset = 0.9;
    this._mousePosition = { x: 0, y: 0 };
    this._targetTick = performance.now();

    this
      .bind()
      .bindEvents();
  }

  get renderer() {
    return this._renderer;
  }

  bind() {
    this._canvasElement = new DomElement('.js-canvas');
    this._canvasContext = this._canvasElement.htmlElement.getContext('2d');
    this._renderer = new GameRenderer(this._canvasContext);

    this._setDefaultSize();

    return this;
  }

  bindEvents() {
    window.addEventListener('resize', this._setDefaultSize.bind(this));
    
    this._canvasElement.on('contextmenu', event => event.preventDefault());
    this._canvasElement.on('mousemove', this._onMouseMove.bind(this));
    this._canvasElement.on('mousedown', this._onMouseDown.bind(this));

    return this;
  }

  _onMouseMove(event) {
    const westBreakpoint = this._canvasElement.htmlElement.clientWidth * (1 - this._scrollOffset);
    const eastBreakpoint = this._canvasElement.htmlElement.clientWidth * this._scrollOffset;
    const northBreakpoint = this._canvasElement.htmlElement.clientHeight * (1 - this._scrollOffset);
    const southBreakpoint = this._canvasElement.htmlElement.clientHeight * this._scrollOffset;

    let scrollDirection = null;

    if (event.x < westBreakpoint && event.y < northBreakpoint) {
      scrollDirection = OPCode.DIRECTION_NWEST;
    } else if (event.x > eastBreakpoint && event.y < northBreakpoint) {
      scrollDirection = OPCode.DIRECTION_NEAST;
    } else if (event.x < westBreakpoint && event.y > southBreakpoint) {
      scrollDirection = OPCode.DIRECTION_SWEST;
    } else if (event.x > eastBreakpoint && event.y > southBreakpoint) {
      scrollDirection = OPCode.DIRECTION_SEAST;
    } else if (event.x < westBreakpoint) {
      scrollDirection = OPCode.DIRECTION_WEST;
    } else if (event.x > eastBreakpoint) {
      scrollDirection = OPCode.DIRECTION_EAST;
    } else if (event.y < northBreakpoint) {
      scrollDirection = OPCode.DIRECTION_NORTH;
    } else if (event.y > southBreakpoint) {
      scrollDirection = OPCode.DIRECTION_SOUTH;
    }

    this._mousePosition = {
      x: Math.round(event.x) + this._renderer.camera.scrollX,
      y: Math.round(event.y) + this._renderer.camera.scrollY
    };

    this._renderer.scrollDirection = scrollDirection;
  }

  _onMouseDown(event) {
    if (event.button === KeyCode.MOUSE2) {
      event.preventDefault();
      event.stopPropagation();
      const now = performance.now();
      const diff = now - this._targetTick;
      if (diff > 100) {
        this._targetTick = now;

        this.fire('playerMove', {
          x: this._mousePosition.x,
          y: this._mousePosition.y
        });
      }
    }
  }

  _setDefaultSize() {
    this._canvasElement.htmlElement.width = this._getDefaultWidth();
    this._canvasElement.htmlElement.height = this._getDefaultHeight();
  }

  _getDefaultWidth() {
    return window.innerWidth && document.documentElement.clientWidth
      ? Math.min(window.innerWidth, document.documentElement.clientWidth)
      : window.innerWidth ||
      document.documentElement.clientWidth ||
      document.getElementsByTagName('body')[0].clientWidth;
  }

  _getDefaultHeight() {
    return window.innerHeight && document.documentElement.clientHeight
      ? Math.min(window.innerHeight, document.documentElement.clientHeight)
      : window.innerHeight ||
      document.documentElement.clientHeight ||
      document.getElementsByTagName('body')[0].clientHeight;
  }
}

module.exports = CanvasElement;
