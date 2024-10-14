import { User } from './user.model';

export interface NewInvite {
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
  invitedBy?: User;
  creationDate?: Date;
  lastModifiedDate?: Date;
  lastInviteSentDate?: Date;
  signupDate?: Date;
  roles: string[];
  cancelled: boolean;
}
