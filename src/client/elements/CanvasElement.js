const Element = require('client/elements/Element');
const DomElement = require('client/util/DomElement');
const KeyCode = require('client/util/KeyCode');
const Graph = require('client/Graph');
const OPCode = require('opCode');

class CanvasElement extends Element {
  constructor() {
    super();

    this._scrollOffset = 0.9;
    this._canvasElement = null;
    this._mousePosition = { x: 0, y: 0 };
    this._targetTick = performance.now();
  }

  get graph() {
    if (this._canvasElement) {
      return this._canvasElement.instance;
    }

    return null;
  }

  bind() {
    this._canvasElement = new DomElement('.js-canvas', Graph);

    return this;
  }

  bindEvents() {
    this._canvasElement.on('contextmenu', event => event.preventDefault());
    this._canvasElement.on('mousemove', this._onMouseMove.bind(this));
    this._canvasElement.on('mousedown', this._onMouseDown.bind(this));

    return this;
  }

  _onMouseMove(event) {
    const westBreakpoint = this.graph.screenWidth * (1 - this._scrollOffset);
    const eastBreakpoint = this.graph.screenWidth * this._scrollOffset;
    const northBreakpoint = this.graph.screenHeight * (1 - this._scrollOffset);
    const southBreakpoint = this.graph.screenHeight * this._scrollOffset;

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
      x: event.x + this.graph.xOffset,
      y: event.y + this.graph.yOffset
    };
    
    this._fire('mouseMove', {
      x: this._mousePosition.x,
      y: this._mousePosition.y,
      direction: scrollDirection 
    });
  }

  _onMouseDown(event) {
    if (event.button === KeyCode.MOUSE2) {
      event.preventDefault();
      event.stopPropagation();
      const now = performance.now();
      const diff = now - this._targetTick;
      if (diff > 100) {
        this._targetTick = now;

        this._fire('playerMove', {
          x: this._mousePosition.x,
          y: this._mousePosition.y
        });
      }
    }
  }
}

module.exports = CanvasElement;
