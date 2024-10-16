export interface NewInvite {
  id: string;
  email: string;
  organizationId: string;
  invitedById: string;
  roles: string[];
}

export interface Invite {
  id: string;
  email: string;
  organizationId: string;
  invitedById: string;
  invitedByName?: string;
  creationDate?: Date;
  lastModifiedDate?: Date;
  lastInviteSentDate?: Date;
  signupDate?: Date;
  roles: string[];
  cancelled: boolean;
}
