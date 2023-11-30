import { Member } from '../models';

export interface MemberViewModel extends Member {
  roleList: string;
}
