import { StrategyBase, BufferValueTemplate, BufferCodec } from 'buffercodec';
import Color from 'common/structures/Color';

export default class ColorStrategy extends StrategyBase<Color> {

  supports(template: BufferValueTemplate): boolean {
    return typeof(template) === 'string' && template === 'color';
  }

  encode(value: Color, template: BufferValueTemplate, codec: BufferCodec) {
    codec.uint8(value.r);
    codec.uint8(value.g);
    codec.uint8(value.b);
  }

  decode(template: BufferValueTemplate, codec: BufferCodec): Color {
    const r = codec.decode({ type: 'uint8' });
    const g = codec.decode({ type: 'uint8' });
    const b = codec.decode({ type: 'uint8' });

    return new Color({ r, g, b });
  }
}