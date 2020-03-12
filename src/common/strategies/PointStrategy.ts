import { StrategyBase, BufferValueTemplate, BufferCodec } from 'buffercodec';
import Point from 'common/structures/Point';

export default class PointStrategy extends StrategyBase<Point> {

  supports(template: BufferValueTemplate): boolean {
    return typeof(template) === 'string' && template === 'point';
  }

  encode(value: Point, template: BufferValueTemplate, codec: BufferCodec) {
    codec.int16(value.x);
    codec.int16(value.y);
  }

  decode(template: BufferValueTemplate, codec: BufferCodec): Point {
    const x = codec.decode({ type: 'int16' });
    const y = codec.decode({ type: 'int16' });

    return new Point({ x, y });
  }
}