import { StatusCode } from 'hono/utils/http-status';
import { Context } from '../config';

export async function cors(ctx: Context, next: any) {
  await next();

  if (ctx.res.headers.has('Access-Control-Allow-Origin')) {
    //
    //  Gotta do it the hard way
    //
    ctx.newResponse(ctx.res.body, <StatusCode>ctx.res.status, {
      ...ctx.res.headers,
      'Access-Control-Allow-Origin': ctx.env.CORS_ORIGINS,
      'Access-Control-Allow-Headers': 'Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
    });
  } else {
    ctx.res.headers.set('Access-Control-Allow-Origin', ctx.env.CORS_ORIGINS);
    ctx.res.headers.set('Access-Control-Allow-Headers', 'authorization, content-type');
    ctx.res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  }
}
