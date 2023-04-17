import * as cookie from 'cookie';
import { Context } from '../config';

export class Logger {
  private readonly namePrefix: string;
  private readonly logs: any[] = [];

  constructor(private readonly ctx: Context) {
    this.namePrefix = `Microsoft.ApplicationInsights.${this.appInsightsKey.replace(/-/g, '')}`;
  }

  private get appInsightsKey(): string {
    return this.ctx.env.APP_INSIGHTS_KEY;
  }

  trackRequest(request: Request, response: Response, duration: number): void {
    const tags = this.getTags(request.headers);
    const cf: any = request.cf || {};

    // Allowed Application Insights payload: https://github.com/microsoft/ApplicationInsights-JS/tree/61b49063eeacda7878a1fda0107bde766e83e59e/legacy/JavaScript/JavaScriptSDK.Interfaces/Contracts/Generated
    this.logs.push({
      iKey: this.appInsightsKey,
      name: `${this.namePrefix}.RequestData`,
      time: new Date(),
      tags,
      data: {
        baseType: 'RequestData',
        baseData: {
          ver: 2,
          id: this.generateUniqueId(),
          properties: {
            // You can add more properties if needed
            HttpReferer: request.headers.get('Referer'),
            ...cf,
          },
          measurements: {},
          responseCode: response.status,
          success: response.status >= 200 && response.status < 400,
          url: request.url,
          source: request.headers.get('CF-Connecting-IP') || '',
          duration, //: 1, // Cloudflare doesn't allow to measure duration. performance.now() is not implemented, and new Date() always return the same value
        },
      },
    });
  }

  trackException(message: string, location: string, exception: Error): void {
    console.log(message);
    console.log(location);
    console.log(exception);
    console.log(exception?.stack?.toString());

    //@ts-ignore
    const cf: any = this.ctx.req.cf || {};
    const tags = this.getTags(this.ctx.req.headers);

    // Allowed Application Insights payload: https://github.com/microsoft/ApplicationInsights-JS/tree/61b49063eeacda7878a1fda0107bde766e83e59e/legacy/JavaScript/JavaScriptSDK.Interfaces/Contracts/Generated
    this.logs.push({
      iKey: this.appInsightsKey,
      name: `${this.namePrefix}.Exception`,
      time: new Date(),
      tags,
      data: {
        baseType: 'ExceptionData',
        baseData: {
          ver: 2,
          properties: {
            // You can add more properties if needed
            HttpReferer: this.ctx.req.headers.get('Referer'),
            Message: message,
            location: location,
            error: JSON.stringify(exception),
            typeName: 'Error',
            ...cf,
          },
          exceptions: [
            {
              typeName: 'Error',
              hasFullStack: false,
              message: exception.message,
              stack: exception?.stack?.toString(),
            },
          ],
        },
      },
    });
  }

  trackDependency(url: string, method: string | undefined, duration: number, request?: Request, response?: Response | null): void {
    const url2 = new URL(url);
    const tags = request ? this.getTags(request.headers) : null;
    const name = `${method} ${url2.pathname}`;
    const cf: any = (request ? request.cf : null) || {};

    // Allowed Application Insights payload: https://github.com/microsoft/ApplicationInsights-JS/tree/61b49063eeacda7878a1fda0107bde766e83e59e/legacy/JavaScript/JavaScriptSDK.Interfaces/Contracts/Generated
    this.logs.push({
      iKey: this.appInsightsKey,
      name: `${this.namePrefix}.RemoteDependency`,
      time: new Date(),
      tags,
      data: {
        baseType: 'RemoteDependencyData',
        baseData: {
          ver: 2,
          data: name,
          duration,
          id: this.generateUniqueId(),
          name,
          properties: {
            HttpMethod: method,
            ...cf,
          },
          resultCode: (response || {}).status,
          success: response && (response.status === 200 || response.status === 204),
          target: url2.hostname,
          type: 'Worker',
        },
      },
    });
  }

  flush(): Promise<Response> {
    return fetch('https://dc.services.visualstudio.com/v2/track', {
      method: 'POST',
      body: JSON.stringify(this.logs),
    });
  }

  private getTags(headers: Headers): Record<string, string> {
    const cookieValue = headers.get('Cookie');
    const tags: Record<string, string> = {
      'ai.location.ip': <string>headers.get('CF-Connecting-IP'),
    };

    if (cookieValue) {
      const cookies = cookie.parse(cookieValue);
      if (cookies['ai_session']) tags['ai.session.id'] = cookies['ai_session'];
      if (cookies['ai_user']) tags['ai.user.id'] = cookies['ai_user'];
    }
    return tags;
  }

  private generateUniqueId() {
    function chr4() {
      return Math.random().toString(16).slice(-4);
    }
    return chr4() + chr4() + '-' + chr4() + '-' + chr4() + '-' + chr4() + '-' + chr4() + chr4() + chr4();
  }
}
