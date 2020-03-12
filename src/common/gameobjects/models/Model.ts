import GameObject from 'common/GameObject';
import { ModelType } from 'common/gameobjects/models/ModelType';

export default abstract class Model extends GameObject {
  type: ModelType = ModelType.Undefined;
  
  speed = 0;
  mass = 0;

  applyDamage(damage: number): void {}
}
