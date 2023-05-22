import { Context } from '../../config';

export class ChecklistHttpService {
  static async getAsync(ctx: Context): Promise<Response> {
    try {
      const data = await ctx.get('data');

      return ctx.json(await data.checklist.getAsync());
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get all checklists.', 'ActivityHttpService.getByIdAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
