import { Context } from '../../config';
import { OnboardRecord } from '../../models';

export class OnboardHttpService {
  static async getAsync(ctx: Context): Promise<Response> {
    try {
      const record = await ctx.var.origin.getAsync<OnboardRecord>();

      if (!record) return ctx.text('Not Found', 404);

      const org = await ctx.var.data.organizations.getByIdAsync(record.organizationId);

      if (!org) return ctx.text('Bad Request', 400);

      record.organizationName = org.name;

      return ctx.json(record);
    } catch (error) {
      ctx.var.logger.trackException('An error occured trying to get the onboard record.', <Error>error);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async postAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, inviteId } = await ctx.req.param();
      const record = await ctx.var.origin.getAsync<OnboardRecord>();
      const results = await ctx.req.json();

      if (!record) return ctx.text('Not Found', 404);

      const resp = await ctx.var.origin.postAsync(results, `onboard/${organization}/${inviteId}`);

      if (resp.status !== 200) throw new Error('Failed to pass to origin');

      const userId: string = await resp.text();
      //
      //  Now save the roles
      //
      ctx.executionCtx.waitUntil(ctx.var.data.members.updateRolesInKv(organization, userId, record.roles));

      return ctx.newResponse(null, 204);
    } catch (error) {
      ctx.var.logger.trackException('An error occured trying to get the onboard record.', <Error>error);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
