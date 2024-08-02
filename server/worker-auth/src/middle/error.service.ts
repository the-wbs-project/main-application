import { HTTPResponseError } from 'hono/types';
import { Context } from '../config';

export async function error(err: Error | HTTPResponseError, ctx: Context) {
  ctx.get('logger').trackException('An uncaught error occured trying to process a request.', <Error>err);

  return ctx.text('Unexpected Error', { status: 500 });
}
