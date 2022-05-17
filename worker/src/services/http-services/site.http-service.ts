import { mapRequestToAsset } from '@cloudflare/kv-asset-handler';
import { TtlConfig } from '../../config';
import { WorkerRequest } from '../worker-request.service';

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

  static async getSiteResourceAsync(req: WorkerRequest): Promise<Response> {
    try {
      return await SiteHttpService.getFromKvAsync(req);
    } catch (e) {
      // if an error is thrown try to serve the asset at 404.html
      req.logException(
        'An error occured trying to get a static file.',
        'SiteService.getSiteAsync',
        <Error>e,
      );
      return new Response('Not Found', { status: 404 });
    }
  }

  static async getSiteAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      const response = await SiteHttpService.getSiteResourceAsync(req);
      const isHtml = SiteHttpService.isHtml(response.headers);

      return isHtml && response.status === 200
        ? SiteHttpService.hydrateAsync(req, response)
        : response;
    } catch (e) {
      // if an error is thrown try to serve the asset at 404.html
      req.logException(
        'An error occured trying to get a the site.',
        'SiteService.getSiteAsync',
        <Error>e,
      );
      return new Response('Not Found', { status: 404 });
    }
  }

  private static async getFromKvAsync(req: WorkerRequest): Promise<Response> {
    try {
      return await req.edge.getAssetFromKV({
        mapRequestToAsset: SiteHttpService.handlePrefix(),
        cacheControl: {
          bypassCache: DEBUG === 'true',
          browserTTL: SiteHttpService.getTtl(req.url, req.config.ttl),
        },
      });
    } catch (e) {
      req.logException(
        'An error occured trying to get a static file from KV.',
        'SiteService.getFromKvAsync',
        <Error>e,
      );
      if (req.config.debug && e instanceof Error)
        return new Response(e.message || e.toString(), { status: 500 });

      return new Response('Not Found', { status: 404 });
    }
  }

  /**
   * Here's one example of how to modify a request to
   * remove a specific prefix, in this case `/docs` from
   * the url. This can be useful if you are deploying to a
   * route on a zone, or if you only want your static content
   * to exist at a specific path.
   */
  private static handlePrefix() {
    return (request: Request) => {
      // compute the default (e.g. / -> in
      // compute the default (e.g. / -> index.html)
      const path = new URL(request.url).pathname;
      const newReq = mapRequestToAsset(request);
      //
      // %20 seems to have problems||?
      //
      if (path.indexOf('%20') > -1) {
        let newPath = path;
        while (newPath.indexOf('%20') > -1) {
          newPath = newPath.replace('%20', ' ');
        }
        return new Request(request.url.replace(path, newPath), newReq);
      }
      //
      //  If this is the actual entry point or not an html file at all, send it away
      //
      if (
        path === '/' ||
        path === '/index.html' ||
        !newReq.url.endsWith('index.html')
      )
        return newReq;

      return new Request(request.url.replace(path, '/index.html'), newReq);
    };
  }

  private static getTtl(url: string, ttl: TtlConfig): number | undefined {
    const path = new URL(url).pathname.toLowerCase();

    if (
      path.indexOf('.jpg') > -1 ||
      path.indexOf('.png') > -1 ||
      path.indexOf('.svg') > -1
    )
      return ttl.images;
    if (path.indexOf('.ttf') > -1 || path.indexOf('.woff') > -1)
      return ttl.fonts;
    if (path.indexOf('.js') > -1 || path.indexOf('.css') > -1) return ttl.jscss;
    if (path.indexOf('.ico') > -1) return ttl.icons;

    return undefined;
  }

  private static async hydrateAsync(
    req: WorkerRequest,
    response: Response,
  ): Promise<Response> {
    const resources = req.user?.userInfo?.culture
      ? await req.data.metadata.getResourcesAsync(
          req.user.userInfo.culture,
          'General',
        )
      : null;

    const data = JSON.stringify({
      resources,
    });
    return new HTMLRewriter()
      .on('head', new ElementHandler(req.config.appInsightsSnippet))
      .on(
        'head',
        new ElementHandler(
          `<script id="edge_state" type="application/json">${data}</script>`,
        ),
      )
      .transform(response);
  }

  private static isHtml(hdrs: Headers): boolean {
    return (
      hdrs.has('Content-Type') &&
      (hdrs.get('Content-Type')?.includes('text/html') || false)
    );
  }
}

class ElementHandler {
  constructor(private readonly body: string) {}

  element(element: any) {
    element.append(this.body, { html: true });
  }
}
