import { Env } from '../../config';
import { Invite } from '../../models';
import { OriginService } from '../origin-services';
import { BaseDataService } from './base.data-service';

export class InviteDataService extends BaseDataService {
  constructor(env: Env, executionCtx: ExecutionContext, origin: OriginService) {
    super(env, executionCtx, origin);
  }

  async getAllAsync(organizationId: string, includeAll: boolean): Promise<Invite[]> {
    const data = await this.origin.getAsync<Invite[]>(`invites/${organizationId}/includeAll/${includeAll}`);

    return data ?? [];
  }

  async getByIdAsync(organizationId: string, inviteId: string): Promise<Invite | null> {
    const data = await this.origin.getAsync<Invite>(`invites/${organizationId}/${inviteId}`);

    return data ?? null;
  }

  async createAsync(invite: Invite): Promise<void> {
    const results = await this.origin.postAsync(invite, `invites/${invite.organizationId}`);

    if (results.status >= 300) {
      throw new Error(`Error creating invite: ${results.statusText}`);
    }
  }

  async updateAsync(invite: Invite): Promise<void> {
    const results = await this.origin.putAsync(invite, `invites/${invite.organizationId}/${invite.id}`);

    if (results.status >= 300) {
      throw new Error(`Error creating invite: ${results.statusText}`);
    }
  }

  async cancelAsync(organizationId: string, inviteId: string): Promise<void> {
    const results = await this.origin.deleteAsync(`invites/${organizationId}/${inviteId}`);

    if (results.status >= 300) {
      throw new Error(`Error creating invite: ${results.statusText}`);
    }
  }
}
