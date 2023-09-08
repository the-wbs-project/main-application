export interface Invite {
  id: string;
  inviter: string;
  invitee: string;
  roles: string[];
  createdAt: Date;
  expiredAt: Date;
}
