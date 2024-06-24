import { Injectable } from '@angular/core';

declare type Context = { [x: string]: any };

@Injectable({ providedIn: 'root' })
export class Logger {
  private static get DD_LOGS(): any {
    //@ts-ignore
    return window.DD_LOGS;
  }

  setGlobalContext(newContext: Context): void {
    Logger.setGlobalContext(newContext);
  }

  static getSessionId(): string {
    return Logger.DD_LOGS.getInternalContext().session_id;
  }

  static setGlobalContext(newContext: Context): void {
    Logger.DD_LOGS.setGlobalContext(newContext);
  }

  debug(message: string, context?: Context): void {
    Logger.DD_LOGS.logger.debug(message, context);
  }

  info(message: string, context?: Context): void {
    Logger.DD_LOGS.logger.info(message, context);
  }

  warn(message: string, context?: Context): void {
    Logger.DD_LOGS.logger.warn(message, context);
  }

  error(message: string, context?: Context): void {
    Logger.DD_LOGS.logger.error(message, context);
  }
}
