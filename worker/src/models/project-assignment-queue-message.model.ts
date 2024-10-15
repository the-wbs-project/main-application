import { UserProfile } from './user-profile.model';

export interface ProjectAssignmentQueueMessage {
  organizationName: string;
  projectName: string;
  user: UserProfile;
  role: string;
  assignment: 'added' | 'removed';
  link: string;
}
