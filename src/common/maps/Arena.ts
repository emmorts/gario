import Map from'common/Map';
import GameObject from 'common/GameObject';
import Player from'common/gameobjects/models/Player';
import { Tileset } from'common/maps/Tileset';
import Point from 'common/structures/Point';

export default class Arena extends Map {

  #lavaTick = 1000;
  #lavaDamage = 4;
  #damageFrequencyPerSecond = 10;
  #tickCooldown: { [key: string]: number } = {};

  applyEffects(gameObject: GameObject, deltaT: number) {
    if (gameObject instanceof Player) {
      const tileX = ~~(gameObject.position.x / this.tileSize);
      const tileY = ~~(gameObject.position.y / this.tileSize);

      const outsideMap = !this.withinBounds(gameObject.position.x, gameObject.position.y);
      const isOnLava = !outsideMap ? this.tiledMap[tileX][tileY] === Tileset.Lava : false;

      if (outsideMap || isOnLava) {
        this.applyDamageOnPlayer(gameObject, deltaT);
      } else if (gameObject.id in this.#tickCooldown) {
        delete this.#tickCooldown[gameObject.id];
      }
    }
  }

  getSpawnPoint(): Point {
    throw new Error(`getSpawnPoint() is not implemented.`);
  }

  private applyDamageOnPlayer(gameObject: GameObject, deltaT: number) {
    if (!(gameObject.id in this.#tickCooldown)) {
      this.#tickCooldown[gameObject.id] = 0;
    }

    const lavaTick = this.#lavaTick / this.#damageFrequencyPerSecond;

    if (this.#tickCooldown[gameObject.id] >= lavaTick) {
      gameObject.applyDamage(this.#lavaDamage * (lavaTick / 1000));

      this.#tickCooldown[gameObject.id] -= lavaTick;
    } else {
      this.#tickCooldown[gameObject.id] += deltaT;
    }
  }
}
