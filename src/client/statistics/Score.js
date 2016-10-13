let instance = null;

export default class Score {
    constructor() {
        this._score = 0;
    }

    static getInstance() {
        if (instance) {
            return instance;
        } else {
            instance = new Score();
            return instance;
        }
    }

    add(s = 1) {
        this._score += s;
    }

    currentScore() {
        return this._score;
    }
}