import { Member } from '@wbs/core/models';

export interface RoleUsersViewModel {
  assigned: Member[];
  unassigned: Member[];
}
