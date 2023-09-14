import { StatusCode } from 'hono/utils/http-status';
import { Context } from '../config';

const headers = 'authorization, content-type, force-refresh';
const methods = 'GET,POST,PUT,DELETE';

export async function cors(ctx: Context, next: any) {
  await next();

  if (ctx.res.headers.has('Access-Control-Allow-Origin')) {
    //
    //  Gotta do it the hard way
    //
    ctx.newResponse(ctx.res.body, <StatusCode>ctx.res.status, {
      ...ctx.res.headers,
      'Access-Control-Allow-Origin': ctx.env.CORS_ORIGINS,
      'Access-Control-Allow-Headers': headers,
      'Access-Control-Allow-Methods': methods,
    });
  } else {
    ctx.res.headers.set('Access-Control-Allow-Origin', ctx.env.CORS_ORIGINS);
    ctx.res.headers.set('Access-Control-Allow-Headers', headers);
    ctx.res.headers.set('Access-Control-Allow-Methods', methods);
  }
}
