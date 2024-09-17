import { UserViewModel } from '../../view-models';

export interface MembershipsEntrypoint {
  getAll(organizationName: string): Promise<UserViewModel[]>;
  add(organizationName: string, members: string[]): Promise<void>;
  delete(organizationName: string, members: string[]): Promise<void>;
  addToRoles(organizationName: string, userId: string, roles: string[]): Promise<void>;
  deleteFromRoles(organizationName: string, userId: string, roles: string[]): Promise<void>;
}
