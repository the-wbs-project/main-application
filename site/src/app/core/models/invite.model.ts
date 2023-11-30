export interface InviteBody {
  inviter: string;
  invitee: string;
  roles: string[];
}

export interface Invite extends InviteBody {
  id: string;
  createdAt: Date;
  expiresAt: Date;
}
