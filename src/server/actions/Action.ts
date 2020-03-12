import * as ws from 'ws';
import * as Schemas from 'common/schemas';
import { OperationCode } from 'common/OperationCode';
import Schema from 'common/Schema';
import { Socket } from 'server/Socket';

export default abstract class Action {
  protected socket: Socket;
  protected actionSchema: Schema;

  #opCode: OperationCode;

  constructor(opCode: OperationCode, socket: Socket) {
    this.socket = socket;
    this.actionSchema = Schemas.get(opCode);
    this.#opCode = opCode;
  }

  get eventName(): string | undefined {
    return undefined;
  }

  execute(buffer: ArrayBuffer): any {
    throw new Error(`execute() must be overriden in an action ${this.constructor.name}`);
  }

  parse(buffer: ArrayBuffer): any {
    if (this.actionSchema) {
      return this.actionSchema.decode(buffer);
    }

    throw new Error(`Schema not provided for '${this.constructor.name} (${this.#opCode})'`);
  }

  build(object?: any) {
    if (this.actionSchema) {
      return this.actionSchema.encode(object);
    }

    throw new Error(`Schema not provided for '${this.constructor.name} (${this.#opCode})'`);
  }

}
