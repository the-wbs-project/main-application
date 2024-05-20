import { Env } from '../../config';
import { DataDogService } from './data-dog.service';

export class JobLogger {
  constructor(private readonly env: Env, private readonly datadog: DataDogService, private readonly hostname: string) {}

  trackEvent(message: string, status: 'Error' | 'Info' | 'Warn' | 'Notice', data?: Record<string, any>): void {
    this.datadog.appendLog({
      ...this.basics({ data }),
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

  private basics(data?: any | undefined): any {
    return {
      ddsource: 'worker',
      ddtags: `env:${this.env.DATADOG_ENV},app:pm-empower`,
      hostname: this.hostname,
      service: 'pm-empower-api',
      data,
    };
  }
}
