import { Context } from '../config';

export async function error(error: Error, ctx: Context) {
  ctx.get('logger').trackException('An uncaught error occured trying to process a request.', error);

  return ctx.text('Unexpected Error', { status: 500 });
}
