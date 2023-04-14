import { UserLite } from '../models';

export class AddUsers {
  static readonly type = '[Users] Add';
  constructor(readonly users: UserLite[]) {}
}
