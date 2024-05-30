import { Injectable } from '@angular/core';
import { datadogLogs } from '@datadog/browser-logs';
import { DD_CONFIG, DD_CONTEXT } from 'src/environments/DATADOG_CONFIG.const';

declare type Context = { [x: string]: any };

@Injectable({ providedIn: 'root' })
export class Logger {
  constructor() {
    datadogLogs.init(DD_CONFIG);
    datadogLogs.logger.setContext(DD_CONTEXT);
  }

  setGlobalContext(newContext: Context): void {
    Logger.setGlobalContext(newContext);
  }

  static setGlobalContext(newContext: Context): void {
    datadogLogs.setGlobalContext(newContext);
  }

  debug(message: string, context?: Context): void {
    datadogLogs.logger.debug(message, context);
  }

  info(message: string, context?: Context): void {
    datadogLogs.logger.info(message, context);
  }

  warn(message: string, context?: Context): void {
    datadogLogs.logger.warn(message, context);
  }

  error(message: string, context?: Context): void {
    datadogLogs.logger.error(message, context);
  }
}
