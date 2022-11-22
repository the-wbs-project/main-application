import * as cookie from 'cookie';

export class Logger {
  private readonly namePrefix: string;
  private readonly logs: any[] = [];

  constructor(private readonly appInsightsKey: string, private readonly request: Request) {
    this.namePrefix = `Microsoft.ApplicationInsights.${this.appInsightsKey.replace(/-/g, '')}`;
  }

  trackRequest(request: Request, response: Response, duration: number): void {
    const tags = this.getTags(request);
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
    const tags = this.getTags(this.request);
    const cf: any = this.request.cf || {};

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
            HttpReferer: this.request.headers.get('Referer'),
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
    const tags = request ? this.getTags(request) : null;
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

  private getTags(request: Request): Record<string, string> {
    const cookieValue = request.headers.get('Cookie');
    const tags: Record<string, string> = {
      'ai.location.ip': <string>request.headers.get('CF-Connecting-IP'),
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
