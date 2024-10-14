import { User } from './user.model';

export interface Invite {
  id: string;
  email: string;
  organizationId: string;
  invitedById: string;
  invitedBy?: User;
  creationDate?: string;
  lastModifiedDate?: string;
  lastInviteSentDate?: string;
  signupDate?: string;
  roles: string[];
  cancelled: boolean;
}
