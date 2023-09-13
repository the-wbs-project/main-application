import { User } from '@wbs/core/models';

export class AddUsers {
  static readonly type = '[Users] Add';
  constructor(readonly users: User[]) {}
}
