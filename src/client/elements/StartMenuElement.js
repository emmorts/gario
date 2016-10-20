const Element = require('client/elements/Element');
const DomElement = require('client/util/DomElement');
const KeyCode = require('client/util/KeyCode');

class StartMenuElement extends Element {
  constructor() {
    super();

    this.valid = true;
    this._validationPattern = /^[a-zA-Z0-9 ]{0,25}$/;
    this._startMenuElement = null;
    this._playerNameElement = null;
    this._playButtonElement = null;
    this._errorElement = null;
  }

  bind() {
    this._startMenuElement = new DomElement('.js-start-menu');
    this._playerNameElement = new DomElement('.js-player-name')
      .on('keyup', this._onPlayerNameChanged.bind(this));
    this._playButtonElement = new DomElement('.js-play-button')
      .on('mouseup', this._onPlayClick.bind(this));
    this._errorElement = new DomElement('.js-error');
 
    this._validate();

    return this;
  }

  _onPlayClick() {
    if (this._valid && !this._playButtonElement.isDisabled) {
      this._startGame();
    }
  }

  _onPlayerNameChanged(event) {
    this._validate(event.target.value);

    if (this._valid && ~[KeyCode.ENTER, KeyCode.MAC_ENTER].indexOf(event.keyCode)) {
      this._startGame();
    }
  }

  _startGame() {
    this._startMenuElement.hide();
    this.fire('startGame', this._playerNameElement.content);
  }

  _validate(playerName = this._playerNameElement.content) {
    this._valid = !!playerName.match(this._validationPattern);

    if (this._valid) {
      this._errorElement.hide();
      this._playButtonElement.enable();
    } else {
      this._errorElement.show();
      this._playButtonElement.disable();
    }
  }
}

module.exports = StartMenuElement;