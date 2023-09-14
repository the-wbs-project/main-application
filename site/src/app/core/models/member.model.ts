import { User } from './user.model';

export interface Member extends User {
  roles: string[];
  roleList: string;
}
