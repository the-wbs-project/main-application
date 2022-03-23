import { mapRequestToAsset } from '@cloudflare/kv-asset-handler';
import { Config } from '../../config';
import { WorkerRequest } from '../worker-request.service';

const ROBOT = `User-agent: *
Disallow: /`;

export class SiteHttpService {
  constructor(private readonly config: Config) {}

  php(): Response {
    return new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  robot(): Response {
    return new Response(ROBOT);
  }

  async getSiteResourceAsync(req: WorkerRequest): Promise<Response> {
    try {
      return await this.getFromKvAsync(req);
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

  async getSiteAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      const response = await this.getSiteResourceAsync(req);
      const isHtml = this.isHtml(response.headers);

      return isHtml && response.status === 200
        ? this.hydrateAsync(req, response)
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

  private async getFromKvAsync(req: WorkerRequest): Promise<Response> {
    const options: any = {};
    options.mapRequestToAsset = this.handlePrefix();
    options.cacheControl = {
      mapRequestToAsset: this.handlePrefix(),
      bypassCache: DEBUG,
      browserTTL: this.getTtl(req.url),
    };

    try {
      return await req.edge.getAssetFromKV(options);
    } catch (e) {
      req.logException(
        'An error occured trying to get a static file from KV.',
        'SiteService.getFromKvAsync',
        <Error>e,
      );
      if (this.config.debug && e instanceof Error)
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
  private handlePrefix() {
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

  private getTtl(url: string): number | null | undefined {
    const path = new URL(url).pathname.toLowerCase();

    if (
      path.indexOf('.jpg') > -1 ||
      path.indexOf('.png') > -1 ||
      path.indexOf('.svg') > -1
    )
      return this.config.ttl.images;
    if (path.indexOf('.ttf') > -1 || path.indexOf('.woff') > -1)
      return this.config.ttl.fonts;
    if (path.indexOf('.js') > -1 || path.indexOf('.css') > -1)
      return this.config.ttl.jscss;
    if (path.indexOf('.ico') > -1) return this.config.ttl.icons;

    return null;
  }

  private async hydrateAsync(
    req: WorkerRequest,
    response: Response,
  ): Promise<Response> {
    const data = JSON.stringify(
      await req.data.initial.getHydrateDataAsync(req.user),
    );
    return new HTMLRewriter()
      .on('head', new ElementHandler(this.config.appInsightsSnippet))
      .on(
        'head',
        new ElementHandler(
          `<script id="edge_state" type="application/json">${data}</script>`,
        ),
      )
      .transform(response);
  }

  private isHtml(hdrs: Headers): boolean {
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
