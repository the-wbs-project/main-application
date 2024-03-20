import { Context } from '../../config';
import { LibraryEntryViewModel } from '../../view-models';

export class LibraryEntryHttpService {
  static async getListAsync(ctx: Context): Promise<Response> {
    try {
      const entries = await ctx.get('origin').getAsync<LibraryEntryViewModel[]>();
      const orgs: Map<string, string> = new Map();

      for (const entry of entries ?? []) {
        if (orgs.has(entry.ownerId)) {
          entry.ownerName = orgs.get(entry.ownerId)!;
        }
        const org = await ctx.get('data').organizations.getNameAsync(entry.ownerId);

        if (org) {
          orgs.set(entry.ownerId, org);
          entry.ownerName = org;
        }
      }
      return ctx.json(entries);
    } catch (e) {
      console.log(e.message);
      ctx.get('logger').trackException('An error occured trying to get an library entries.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
