import { RpcTarget } from 'cloudflare:workers';
import { Env } from '../../config';
import { InviteBody } from '../../models';
import { Helper } from './_helper.service';

export class InvitesRpc extends RpcTarget {
  private readonly helper: Helper;

  constructor(private readonly env: Env, private readonly ctx: ExecutionContext) {
    super();
    this.helper = new Helper(this.env, this.ctx);
  }

  async getAll(organizationName: string) {
    try {
      return await this.helper.data.invites.getAllAsync(await this.helper.getOrgId(organizationName));
    } catch (e) {
      this.helper.logger.trackException('An error occured trying to get all invites for an organization.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }

  async send(organizationName: string, inviteBody: InviteBody) {
    try {
      return await this.helper.data.invites.sendAsync(await this.helper.getOrgId(organizationName), inviteBody);
    } catch (e) {
      this.helper.logger.trackException('An error occured trying to send an invite.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }

  async delete(organizationName: string, inviteId: string) {
    try {
      return await this.helper.data.invites.deleteAsync(await this.helper.getOrgId(organizationName), inviteId);
    } catch (e) {
      this.helper.logger.trackException('An error occured trying to delete memberships', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.helper.datadog.flush());
    }
  }
}
