import { LogLevel } from "./LogLevel";

export default interface ILogger {
  name: string;

  setNext(logger: ILogger): void;
  log(message: string, severity: LogLevel): void;
}