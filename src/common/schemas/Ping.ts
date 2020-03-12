import { OperationCode } from 'common/OperationCode';
import Schema from 'common/Schema';

export interface TPingEncodeSchema {
  timestamp: string
}

export interface TPingDecodeSchema {
  timestamp: number
}

export const PingSchema = new Schema<TPingEncodeSchema, TPingDecodeSchema>(OperationCode.PING, {
  timestamp: 'string',
}, ({ timestamp }) => ({
  timestamp: Number(timestamp),
}));
