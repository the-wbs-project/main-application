import { Context } from '../config';

export async function cors(ctx: Context, next: any) {
  await next();

  ctx.res.headers.set('Access-Control-Allow-Origin', ctx.env.CORS_ORIGINS);
  ctx.res.headers.set('Access-Control-Allow-Headers', 'Authorization');
  ctx.res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');

  /*return cors2({
    origin: ctx.env.CORS_ORIGINS,
    allowHeaders: ['Authorization'],
    allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })(ctx, next); */
}
