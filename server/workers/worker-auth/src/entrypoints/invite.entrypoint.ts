import { InviteBody } from '../models';
import { BaseEntrypoint } from './base.entrypoint';

export class InviteEntrypoint extends BaseEntrypoint {
  async getAll(organizationName: string) {
    try {
      return await this.data.invites.getAllAsync(await this.getOrgId(organizationName));
    } catch (e) {
      this.logger.trackException('An error occured trying to get all invites for an organization.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }

  async send(organizationName: string, inviteBody: InviteBody) {
    try {
      return await this.data.invites.sendAsync(await this.getOrgId(organizationName), inviteBody);
    } catch (e) {
      this.logger.trackException('An error occured trying to send an invite.', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }

  async delete(organizationName: string, inviteId: string) {
    try {
      return await this.data.invites.deleteAsync(await this.getOrgId(organizationName), inviteId);
    } catch (e) {
      this.logger.trackException('An error occured trying to delete memberships', <Error>e);
      throw e;
    } finally {
      this.ctx.waitUntil(this.datadog.flush());
    }
  }
}
