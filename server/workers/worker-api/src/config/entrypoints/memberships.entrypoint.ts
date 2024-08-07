import { Member } from '../../models';

export interface MembershipsEntrypoint {
  getAll(organizationName: string): Promise<Member[]>;
  get(organizationName: string, userId: string): Promise<Member>;
  add(organizationName: string, members: string[]): Promise<void>;
  delete(organizationName: string, members: string[]): Promise<void>;
  addToRoles(organizationName: string, userId: string, roles: string[]): Promise<void>;
  deleteFromRoles(organizationName: string, userId: string, roles: string[]): Promise<void>;
}
