class Sprite {
  constructor(path, frameWidth, frameHeight) {
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;

    this._path = path;
    this._isLoaded = false;
    this._image = new Image();
  }

  get image() {
    if (this._isLoaded) {
      return this._image;
    }

    return null;
  }

  get isLoaded() {
    return this._isLoaded;
  }

  load() {
    this._image.src = `sprites/${this._path}`;
    this._image.onload = () => {
      this._framesPerRow = (this._image.width / this.frameHeight) | 0;
      this._isLoaded = true;
    };
  }
}

module.exports = Sprite;
