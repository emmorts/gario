import { BufferSchema, BufferTemplate, BufferStrategy } from 'buffercodec';
import Strategies from 'common/strategies';
import { OperationCode } from './OperationCode';

export default class Schema<IEncode=any, IDecode=IEncode> extends BufferSchema {
  #opCode: OperationCode;
  #transformFn?: (object: any) => IDecode;

  constructor(opCode: OperationCode, schema: BufferTemplate, transformFn?: (object: IEncode) => IDecode) {
    super({
      opCode: 'uint8',
      ...schema
    });

    if (opCode === null || opCode === undefined) {
      throw new Error('Operation code must be provided');
    }

    this.#opCode = opCode;
    this.#transformFn = transformFn;

    BufferStrategy.add(...Strategies)
  }

  encode(object: IEncode): ArrayBuffer {
    return super.encode({
      opCode: this.#opCode,
      ...object
    });
  }

  decode(buffer: ArrayBuffer): IDecode | null {
    if (buffer && buffer.byteLength) {
      const result: IEncode = super.decode(buffer);

      if (this.#transformFn) {
        return this.#transformFn(result);
      }
    }

    return null;
  }
}
