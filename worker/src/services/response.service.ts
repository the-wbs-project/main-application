export class ResponseService {
  private readonly headers: { [key: string]: string };

  constructor() {
    this.headers = {
      'Access-Control-Allow-Origin': CORS_URLS,
      'Access-Control-Request-Method': 'POST',
    };
  }

  async optionsAsync(): Promise<Response> {
    return new Response('', { headers: this.headers });
  }

  rebuild(res: Response): Response {
    const hdrs = new Headers(res.headers);

    hdrs.set('Access-Control-Allow-Origin', CORS_URLS);
    hdrs.set('Access-Control-Request-Method', 'POST');

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: hdrs,
    });
  }

  match(req: Request, match: Response): Response {
    const status = match.headers.get('cf-cache-status');
    const hdrs = new Headers({
      'content-type': 'application/json;charset=utf-8',
      ...this.headers,
    });
    if (status) hdrs.set('cf-cache-status', status);

    return new Response(match.body, {
      status: 200,
      headers: hdrs,
    });
  }
}
