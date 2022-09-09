import { serveSinglePageApp } from '@cloudflare/kv-asset-handler';
import { TTL } from '../../consts';
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

      //return resp;
    } catch (e) {
      // if an error is thrown try to serve the asset at 404.html
      req.logException('An error occured trying to get a static file.', 'SiteService.getSiteAsync', <Error>e);
      return new Response('Not Found', { status: 404 });
    }
  }

  static async getSiteAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      return await SiteHttpService.getSiteResourceAsync(req);
      /*const response = await SiteHttpService.getSiteResourceAsync(req);
      const isHtml = SiteHttpService.isHtml(response.headers);

      return isHtml && response.status === 200
        ? SiteHttpService.hydrateAsync(req, response)
        : response;*/
    } catch (e) {
      // if an error is thrown try to serve the asset at 404.html
      req.logException('An error occured trying to get a the site.', 'SiteService.getSiteAsync', <Error>e);
      return new Response('Not Found', { status: 404 });
    }
  }

  private static async getFromKvAsync(req: WorkerRequest): Promise<Response> {
    try {
      const ttl = SiteHttpService.getTtl(req);

      return await req.services.edge.getAssetFromKV({
        mapRequestToAsset: serveSinglePageApp,
        cacheControl: {
          bypassCache: req.config.debug,
          browserTTL: ttl,
          edgeTTL: ttl,
        },
      });
    } catch (e) {
      req.logException('An error occured trying to get a static file from KV.', 'SiteService.getFromKvAsync', <Error>e);
      if (req.config.debug && e instanceof Error) return new Response(e.message || e.toString(), { status: 500 });

      return new Response('Not Found', { status: 404 });
    }
  }

  private static getTtl(req: WorkerRequest): number | undefined {
    const url = req.url;
    const path = new URL(url).pathname.toLowerCase();

    if (path.indexOf('.jpg') > -1 || path.indexOf('.png') > -1 || path.indexOf('.svg') > -1) return TTL.images;
    if (path.indexOf('.ttf') > -1 || path.indexOf('.woff') > -1) return TTL.fonts;
    if (path.indexOf('.js') > -1 || path.indexOf('.css') > -1) return TTL.jscss;
    if (path.indexOf('.ico') > -1) return TTL.icons;
    if (this.isHtml(req.headers)) return TTL.html;

    return undefined;
  }

  private static isHtml(hdrs: Headers): boolean {
    return hdrs.has('Content-Type') && (hdrs.get('Content-Type')?.includes('text/html') || false);
  }
}
