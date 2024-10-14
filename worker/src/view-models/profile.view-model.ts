import { Organization } from '../models';

export interface ProfileViewModel {
  userId: string;
  fullName: string;
  email: string;
  memberships: Organization[];
}
