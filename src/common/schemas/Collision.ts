import { OperationCode } from 'common/OperationCode';
import Schema from 'common/Schema';

export interface TCollisionSchema {
  actorId: string,
  colliderId: string,
}

export const CollisionSchema = new Schema<TCollisionSchema>(OperationCode.COLLISION, {
  actorId: 'string',
  colliderId: 'string',
});
