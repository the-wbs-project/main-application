import { TTL } from '../../consts';
import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

const ROBOT = `User-agent: *
Disallow: /`;

export class SiteHttpService {
  static php(): Response {
    return new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  static robot(): Response {
    return new Response(ROBOT);
  }

  static async getSiteAsync(req: WorkerRequest): Promise<Response> {
    try {
      const cache = !req.config.debug;
      if (cache) {
        const matched = await req.services.edge.cacheMatch();

        if (matched) return matched;
      }
      const url = new URL(req.url);
      url.pathname = '/index.html';

      console.log(url.toString());
      const originResponse = await req.myFetch(url.toString());

      let fullResponse = new Response(originResponse.body, {
        status: originResponse.status,
        statusText: originResponse.statusText,
        headers: getHeaders(req, originResponse.headers),
      });

      if (fullResponse.status === 200) {
        fullResponse = await hydrateAsync(req, fullResponse);

        if (cache) {
          req.services.edge.cachePut(fullResponse);
        }
      }
      return fullResponse;
    } catch (e) {
      // if an error is thrown try to serve the asset at 404.html
      req.logException('An error occured trying to get a static file.', 'SiteService.getSiteAsync', <Error>e);
      return new Response('Not Found', { status: 404 });
    }
  }

  static async getSiteResourceAsync(req: WorkerRequest): Promise<Response> {
    try {
      const cache = !req.config.debug;
      if (cache) {
        const matched = await req.services.edge.cacheMatch();

        if (matched) return matched;
      }
      const originResponse = await req.myFetch(req.url);
      const fullResponse = new Response(originResponse.body, {
        status: originResponse.status,
        statusText: originResponse.statusText,
        headers: getHeaders(req, originResponse.headers),
      });

      if (fullResponse.status === 200 && cache) req.services.edge.cachePut(fullResponse);

      return fullResponse;
    } catch (e) {
      // if an error is thrown try to serve the asset at 404.html
      req.logException('An error occured trying to get a static file.', 'SiteService.getSiteAsync', <Error>e);
      return new Response('Not Found', { status: 404 });
    }
  }
}

async function hydrateAsync(req: WorkerRequest, response: Response): Promise<Response> {
  return new HTMLRewriter().on('script[id="app_insights"]', new ElementHandler(`"${req.config.appInsightsKey}"`)).transform(response);
}

function getHeaders(req: WorkerRequest, initHeaders: Headers): Headers {
  const ttl = getTtl(req);
  const headers = new Headers(initHeaders);

  BaseHttpService.getAuthHeaders(req, headers);

  if (!req.config.debug && ttl) headers.set('cache-control', 'public, max-age=' + ttl);

  return headers;
}

function getTtl(req: WorkerRequest): number | undefined {
  const url = req.url;
  const path = new URL(url).pathname.toLowerCase();

  if (path.indexOf('.jpg') > -1 || path.indexOf('.png') > -1 || path.indexOf('.svg') > -1) return TTL.images;
  if (path.indexOf('.ttf') > -1 || path.indexOf('.woff') > -1) return TTL.fonts;
  if (path.indexOf('.js') > -1 || path.indexOf('.css') > -1) return TTL.jscss;
  if (path.indexOf('.ico') > -1) return TTL.icons;
  if (isHtml(req.headers)) return TTL.html;

  return undefined;
}

function isHtml(hdrs: Headers): boolean {
  return hdrs.has('Content-Type') && (hdrs.get('Content-Type')?.includes('text/html') || false);
}

class ElementHandler {
  constructor(private readonly body: string) {}

  element(element: any) {
    element.setInnerContent(this.body, { html: true });
  }
}
