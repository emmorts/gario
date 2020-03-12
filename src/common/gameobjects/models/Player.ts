import Point from 'common/structures/Point';
import Velocity from 'common/structures/Velocity';
import Color from 'common/structures/Color';
import Model from 'common/gameobjects/models/Model';
import { ModelType } from 'common/gameobjects/models/ModelType';
import * as MathUtils from 'common/utils/MathUtils';
import Logger from 'server/Logger';

interface PlayerSpawnParameters {
  position: Point,
  color: Color,
  maxHealth: number,
  health: number
}

export default class Player extends Model {
  type: ModelType.Player;
  
  name: string;
  speed = 0;
  mass = 0;

  protected _position: Point;
  protected _radius: number = 20;

  #health: number = 0;
  #maxHealth: number = 0;
  #speed: number = 3;
  #acceleration: number = 0.1;
  #rotation: number = 0;
  #damageModifier: number = 1;
  #knockbackModifier: number = 1;
  #velocity: Velocity = Velocity.ZERO;
  #baseFriction: number = 0.2;
  #friction: number;
  #baseRotationTicks: number = 10;
  #rotationTicks: number;
  #baseCastTicks: number = 10;
  #castTicks: number;
  #baseRadius: number;
  #maxRadius: number = 25;
  #stunnedTicks: number = 0;
  #mass: number = 10;
  #target: Point = Point.ZERO;
  #targetRotation: number = 0;
  #color: Color;

  constructor(name: string) {
    super();

    this.name = name;
  }

  get position() {
    return this._position;
  }

  get health() {
    return this.#health;
  }

  set health(value) {
    this.#health = Math.max(value, 0);
  }

  update(deltaT: number) {
    if (typeof this.#target.x !== 'undefined' && typeof this.#target.y !== 'undefined') {
      this.calculatePosition(deltaT);
    }
    if (typeof this.#targetRotation !== 'undefined') {
      this.calculateRotation(deltaT);
    }
  }

  spawn(parameters: PlayerSpawnParameters) {
    if (parameters) {
      this.#color = parameters.color;
      this.#maxHealth = parameters.maxHealth;
      this.#health = parameters.health;
      this._position.x = parameters.position.x;
      this._position.y = parameters.position.y;
      this.#target.x = parameters.position.x;
      this.#target.y = parameters.position.y;
    } else {
      Logger.error(`No spawn parameters provided for player ${this.id}.`);
    }
  }

  applyDamage(damage: number) {
    this.health = Math.max(this.health - damage, 0);
  }

  setTarget(target: Point) {
    this.#target = new Point(target);

    this.#targetRotation = Math.atan2(target.y - this._position.y, target.x - this._position.x);

    const diff = Math.abs(this.#targetRotation - this.#rotation);

    if (diff > Math.PI / 2) {
      this.#friction = this.#baseFriction;
    }
  }

  setStunned(stunDurationTicks: number) {
    this.#stunnedTicks = Math.max(stunDurationTicks, this.#stunnedTicks);
  }

  addVelocity(velocity: Velocity) {
    this.#velocity.x += velocity.x;
    this.#velocity.y += velocity.y;
  }

  private calculatePosition(deltaT: number) {
    if (!MathUtils.arePointsRoughlyEqual(this._position, this.#target) || this.#stunnedTicks) {
      if (this.#friction < 1) {
        this.#friction += this.#acceleration;
      }

      const speed = this.#speed * this.#friction;
      let velX = this.#velocity.x;
      let velY = this.#velocity.y;
      let velocity = 0;
      let fn;

      if (!this.#stunnedTicks) {
        const vX = this.#target.x - this._position.x;
        const vY = this.#target.y - this._position.y;
        const distance = MathUtils.getHypotenuseLength(vX, vY);

        velX = (vX / distance) * speed;
        velY = (vY / distance) * speed;
      }

      if (Math.abs(this.#velocity.x - velX) > this.#acceleration) {
        velocity = this.#acceleration * Math.sign(velX);
        fn = Math.sign(velX) !== 1 ? Math.max : Math.min;
        this.#velocity.x = fn(this.#velocity.x + velocity, Math.sign(velX) * speed);
      } else {
        this.#velocity.x = velX;
      }

      if (Math.abs(this.#velocity.y - velY) > this.#acceleration) {
        velocity = this.#acceleration * Math.sign(velY);
        fn = Math.sign(velY) !== 1 ? Math.max : Math.min;
        this.#velocity.y = fn(this.#velocity.y + velocity, Math.sign(velY) * speed);
      } else {
        this.#velocity.y = velY;
      }

      this._position.x += this.#velocity.x;
      this._position.y += this.#velocity.y;

      if (this.#stunnedTicks) {
        this.#velocity.x *= (1 - this.#acceleration);
        this.#velocity.y *= (1 - this.#acceleration);
        this.#target.x = this._position.x;
        this.#target.y = this._position.y;
        this.#stunnedTicks -= 1;
      }
    } else {
      this.#friction = this.#baseFriction;
      this.#velocity = { x: 0, y: 0 };
    }
  }

  private calculateRotation(deltaT: number) {
    if (Math.abs(this.#rotation - this.#targetRotation) > 1e-5) {
      if (this.#rotationTicks > 0) {
        if (this.#rotation > Math.PI) {
          this.#rotation = -Math.PI - (Math.PI - Math.abs(this.#rotation));
        } else if (this.#rotation < -Math.PI) {
          this.#rotation = Math.PI + (Math.PI - Math.abs(this.#rotation));
        }
        if (Math.abs(this.#targetRotation - this.#rotation) > Math.PI) {
          const diffA = Math.PI - Math.abs(this.#rotation);
          const diffB = Math.PI - Math.abs(this.#targetRotation);
          const diff = diffA + diffB;
          if (this.#rotation > 0) {
            this.#rotation += diff / this.#rotationTicks;
          } else {
            this.#rotation -= diff / this.#rotationTicks;
          }
        } else {
          this.#rotation += (this.#targetRotation - this.#rotation) / this.#rotationTicks;
        }
      } else {
        this.#rotation = this.#targetRotation;
        this.#rotationTicks = this.#baseRotationTicks;
      }
    }
  }

}
