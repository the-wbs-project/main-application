import { Injectable } from '@angular/core';
import { datadogLogs } from '@datadog/browser-logs';
import { environment } from 'src/environments/environment';

declare type Context = { [x: string]: any };

@Injectable({ providedIn: 'root' })
export class Logger {
  static setup(): void {
    datadogLogs.init(environment.datadog);
    datadogLogs.logger.setContext(environment.datadogContext);
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
    console.log(message);
    datadogLogs.logger.error(message, context);
  }
}
