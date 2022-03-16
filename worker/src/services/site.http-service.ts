import { mapRequestToAsset, Options } from '@cloudflare/kv-asset-handler';
import { Request as Request2 } from 'itty-router';
import { WorkerCall } from './worker-call.service';

//const ROBOT = `User-agent: *
//Disallow: /`;

export class SiteHttpService {
  //robot(): Response {
  //  return new Response(ROBOT);
  //}

  async getSiteResourceAsync(
    request: Request2,
    call: WorkerCall,
  ): Promise<Response> {
    try {
      return await this.getFromKvAsync(request, call);
    } catch (e) {
      // if an error is thrown try to serve the asset at 404.html
      call.logException(
        'An error occured trying to get a static file.',
        'SiteService.getSiteResourceAsync',
        <Error>e,
      );
      return new Response('Not Found', { status: 404 });
    }
  }

  private async getFromKvAsync(
    request: Request2,
    call: WorkerCall,
  ): Promise<Response> {
    const options: Partial<Options> = {};
    options.mapRequestToAsset = this.handlePrefix();
    options.cacheControl = {
      bypassCache: false,
      browserTTL: this.getTtl(request),
    };

    try {
      return await call.getAssetFromKV(options);
    } catch (e) {
      call.logException(
        'An error occured trying to get a static file from KV.',
        'SiteService.getFromKvAsync',
        <Error>e,
      );
      if (e instanceof Error)
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
        console.log(path);
        let newPath = path;
        while (newPath.indexOf('%20') > -1) {
          newPath = newPath.replace('%20', ' ');
        }
        console.log(newPath);
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

  private getTtl(request: Request2): number | undefined {
    const path = new URL(request.url).pathname.toLowerCase();

    if (
      path.indexOf('.jpg') > -1 ||
      path.indexOf('.png') > -1 ||
      path.indexOf('.svg') > -1
    )
      return 86400;
    if (path.indexOf('.ttf') > -1 || path.indexOf('.woff') > -1) return 86400;
    if (path.indexOf('.js') > -1 || path.indexOf('.css') > -1) return 600;
    if (path.indexOf('.ico') > -1) return 600;
  }
}
