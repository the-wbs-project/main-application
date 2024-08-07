export interface Invite {
  id: string;
  createdAt: Date;
  expiresAt: Date;
  inviter: string;
  invitee: string;
  roles: string[];
}

export interface InviteBody {
  inviter: string;
  invitee: string;
  roles: string[];
}
