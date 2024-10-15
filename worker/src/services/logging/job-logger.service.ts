import { Env } from '../../config';
import { DataDogService } from './data-dog.service';
import { Logger } from './logger.service';

export class JobLogger implements Logger {
  constructor(private readonly env: Env, private readonly datadog: DataDogService) {}

  trackRequest(duration: number): void {}

  trackEvent(
    message: string,
    status: 'Error' | 'Info' | 'Warn' | 'Notice',
    data?: Record<string, any>,
    ddsource?: string,
    service?: string,
  ): void {
    this.datadog.appendLog({
      ...this.basics({ data }, ddsource, service),
      status,
      message: message,
    });
  }

  trackException(message: string, exception: Error, data?: Record<string, any>): void {
    this.datadog.appendLog({
      ...this.basics({
        data: {
          data,
          message: exception ? exception.message : 'No Exception Provided',
          stack: exception ? exception.stack?.toString() : 'No Exception Provided',
        },
      }),
      status: 'Error',
      message: message,
    });
  }

  trackDependency(url: string, method: string, duration: number, request: Request, response?: Response): void {
    this.datadog.appendLog({
      ...this.basics({
        duration,
        request,
        resStatus: response?.status,
        data: {
          dependency: {
            status: response ? response.status : null,
            url,
            method,
            duration,
          },
        },
      }),
      status: 'Info',
      message: `Dependency, ${method}, ${url} (${duration}ms)`,
    });
  }

  private basics(data?: any | undefined, ddsource = 'worker', service = 'pm-empower-worker'): any {
    return {
      ddsource,
      ddtags: `env:${this.env.DATADOG_ENV},app:pm-empower`,
      hostname: this.env.DATADOG_HOST,
      service,
      data,
    };
  }
}
