export interface Invite {
  id: string;
  email: string;
  organizationId: string;
  invitedById: string;
  invitedByName?: string;
  creationDate?: string;
  lastModifiedDate?: string;
  lastInviteSentDate?: string;
  signupDate?: string;
  roles: string[];
  cancelled: boolean;
}
