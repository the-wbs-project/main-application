import { Invite } from '../models/invite.model';

export interface InviteViewModel extends Invite {
  roleList: string;
}
