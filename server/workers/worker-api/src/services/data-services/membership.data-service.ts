import { MembershipsEntrypoint } from '../../config';
import { Member } from '../../models';

export class MembershipDataService {
  constructor(private readonly service: MembershipsEntrypoint) {}

  getAllAsync(name: string): Promise<Member[]> {
    return this.service.getAll(name);
  }

  getAsync(name: string, userId: string): Promise<Member | undefined> {
    return this.service.get(name, userId);
  }

  addAsync(name: string, members: string[]): Promise<void> {
    return this.service.add(name, members);
  }

  deleteAsync(name: string, members: string[]): Promise<void> {
    return this.service.delete(name, members);
  }

  addToRolesAsync(name: string, userId: string, roles: string[]): Promise<void> {
    return this.service.addToRoles(name, userId, roles);
  }

  deleteFromRolesAsync(name: string, userId: string, roles: string[]): Promise<void> {
    return this.service.deleteFromRoles(name, userId, roles);
  }
}
