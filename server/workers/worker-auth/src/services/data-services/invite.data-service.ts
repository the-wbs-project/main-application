import { Invite, InviteBody } from '../../models';
import { Auth0Service } from '../api-services';

export class InviteDataService {
  constructor(private readonly api: Auth0Service) {}

  getAllAsync(organizationId: string): Promise<Invite[]> {
    return this.api.invites.getAllAsync(organizationId);
  }

  sendAsync(organizationId: string, inviteBody: InviteBody): Promise<void> {
    return this.api.invites.createAsync(organizationId, inviteBody);
  }

  deleteAsync(organizationId: string, inviteId: string): Promise<void> {
    return this.api.invites.deleteAsync(organizationId, inviteId);
  }
}
