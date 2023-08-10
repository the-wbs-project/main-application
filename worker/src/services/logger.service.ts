import { Context } from '../config';

export class Logger {
  private readonly logs: any[] = [];

  constructor(private readonly ctx: Context) {}

  trackRequest(duration: number): void {
    this.logs.push({
      ...this.basics({ duration, resStatus: this.ctx.res.status }),
      status: 'Info',
      message: `Request, ${this.ctx.req.url} (${duration}ms)`,
    });
  }

  trackEvent(message: string, status: 'Error' | 'Info' | 'Warn' | 'Notice', data?: Record<string, any>): void {
    this.logs.push({
      ...this.basics({ data }),
      status,
      message: message,
    });
  }

  trackException(message: string, location: string, exception: Error, data?: Record<string, any>): void {
    this.logs.push({
      ...this.basics({
        data: {
          location,
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
    this.logs.push({
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
      message: `Dependency, ${url} (${method})`,
    });
  }

  async flush(): Promise<Response | void> {
    try {
      const res = await fetch('https://http-intake.logs.us5.datadoghq.com/api/v2/logs', {
        method: 'POST',
        body: JSON.stringify(this.logs),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'DD-API-KEY': this.ctx.env.DATADOG_API_KEY,
        },
      });

      return res;
    } catch (e) {
      //@ts-ignore
      console.log(e.message);
    }
  }

  private basics(info: {
    resStatus?: number | undefined;
    duration?: number | undefined;
    request?: { url: string; method: string; headers: Headers };
    data?: any | undefined;
  }): any {
    if (!info.request) info.request = this.ctx.req;

    const url = new URL(this.ctx.req.url);
    const cf: Record<string, any> = (<any>info.request).cf || {};

    return {
      ddsource: 'worker',
      ddtags: `env:${this.ctx.env.DATADOG_ENV},app:pm-empower`,
      hostname: url.host,
      service: 'pm-empower-api',
      session_id: info.request.headers.get('dd_session_id'),
      http: {
        url: info.request.url,
        status_code: info.resStatus,
        method: info.request.method,
        userAgent: info.request.headers.get('User-Agent'),
        version: cf['httpProtocol'],
        url_details: {
          host: url.host,
          port: url.port,
          path: url.pathname,
        },
      },
      network: {
        client: {
          geoip: {
            country: {
              iso_code: cf['country'],
            },
            continent: {
              code: cf['continent'],
            },
            city: {
              name: cf['city'],
            },
          },
        },
      },
      usr: this.ctx.get('user'),
      ...(info.duration
        ? {
            performance: {
              duration: info.duration,
            },
          }
        : {}),
      ...(info.data
        ? {
            data: info.data,
          }
        : {}),
    };
  }
}
