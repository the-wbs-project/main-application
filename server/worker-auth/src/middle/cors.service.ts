import { cors as honoCors } from 'hono/cors';
import { Context } from '../config';

export async function cors(ctx: Context, next: any) {
  const handler = honoCors({
    origin: ctx.env.CORS_ORIGINS.split(','),
    allowHeaders: ['authorization', 'content-type', 'force-refresh', 'x-filename'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
  return handler(ctx, next);
}
