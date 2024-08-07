import { InviteEntrypoint } from '../../config';
import { Invite, InviteBody } from '../../models';

export class InvitesDataService {
  constructor(private readonly service: InviteEntrypoint) {}

  getAllAsync(organizationName: string): Promise<Invite[]> {
    return this.service.getAll(organizationName);
  }

  sendAsync(organizationName: string, inviteBody: InviteBody): Promise<void> {
    return this.service.send(organizationName, inviteBody);
  }

  deleteAsync(organizationName: string, inviteId: string): Promise<void> {
    return this.service.delete(organizationName, inviteId);
  }
}
