import { Env } from '../../config';
import { Invite } from '../../models';
import { OriginService } from '../origin-services';
import { BaseDataService } from './base.data-service';

export class InvitesDataService extends BaseDataService {
  constructor(env: Env, executionCtx: ExecutionContext, origin: OriginService) {
    super(env, executionCtx, origin);
  }

  async getAsync(organizationId: string, all: boolean): Promise<Invite[]> {
    return (await this.origin.getAsync<Invite[]>(`invites/${organizationId}/${all}`)) ?? [];
  }

  async createInviteAsync(invite: Invite): Promise<void> {
    await this.origin.postAsync(invite, `invites/${invite.organizationId}`);
  }

  async updateInviteAsync(invite: Invite): Promise<void> {
    await this.origin.putAsync(invite, `invites/${invite.organizationId}/${invite.id}`);
  }

  async cancelInviteAsync(organizationId: string, inviteId: string): Promise<void> {
    await this.origin.deleteAsync(`invites/${organizationId}/${inviteId}`);
  }
}
