import { Invite, InviteBody } from '../../models';

export interface InviteEntrypoint {
  getAll(organizationName: string): Promise<Invite[]>;
  send(organizationName: string, inviteBody: InviteBody): Promise<void>;
  delete(organizationName: string, inviteId: string): Promise<void>;
}
