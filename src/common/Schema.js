const BufferCodec = require('buffercodec');
const BufferSchema = BufferCodec.Schema;

class Schema extends BufferSchema {

  constructor(opCode, schema, transform) {
    if (!opCode) throw new Error("Operation code must be provided");

    super(schema, transform);

    this.opCode = opCode;
  }

  encode(object) {
    const codec = BufferCodec().uint8(this.opCode);

    return super.encode(object, codec);
  }

  decode(buffer) {
    return super.decode(buffer);
  }
  
}

module.exports = Schema;