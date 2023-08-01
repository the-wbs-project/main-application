import { UserLite } from '@wbs/core/models';

export interface RoleUsersViewModel {
  assigned: UserLite[];
  unassigned: UserLite[];
}
