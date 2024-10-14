import { Context } from '../../config';
import { OnboardingRecord } from '../../models';
import { HttpOriginService } from '../origin-services';

export class OnboardHttpService {
  static async getAsync(ctx: Context): Promise<Response> {
    try {
      const record = await ctx.var.origin.getAsync<OnboardingRecord>();

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
      const { organizationId, inviteId } = await ctx.req.param();
      const record = await ctx.var.origin.getAsync<OnboardingRecord>();

      if (!record) return ctx.text('Not Found', 404);

      const resp = await HttpOriginService.pass(ctx);

      if (resp.status !== 200) throw new Error('Failed to pass to origin');

      const userId: string = await resp.json();
      //
      //  Now save the roles
      //
      await ctx.var.data.members.putRolesAsync(organizationId, userId, record.roles);

      return ctx.newResponse(null, 204);
    } catch (error) {
      ctx.var.logger.trackException('An error occured trying to get the onboard record.', <Error>error);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
