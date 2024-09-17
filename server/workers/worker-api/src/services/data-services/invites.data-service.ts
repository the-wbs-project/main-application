import { AuthEntrypoint, InviteEntrypoint } from '../../config';
import { Invite, InviteBody } from '../../models';

export class InvitesDataService {
  constructor(private readonly authApi: AuthEntrypoint) {}

  async getAllAsync(organizationName: string): Promise<Invite[]> {
    return (await this.service()).getAll(organizationName);
  }

  async sendAsync(organizationName: string, inviteBody: InviteBody): Promise<void> {
    return (await this.service()).send(organizationName, inviteBody);
  }

  async deleteAsync(organizationName: string, inviteId: string): Promise<void> {
    return (await this.service()).delete(organizationName, inviteId);
  }

  private async service(): Promise<InviteEntrypoint> {
    return this.authApi.invites();
  }
}
