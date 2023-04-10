import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { UsersState } from '@wbs/core/states';

@Pipe({ name: 'userEmail' })
export class UserEmailPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(userId: string | undefined | null): string {
    if (!userId) return '';

    return (
      this.store.selectSnapshot(UsersState.usersById).get(userId)?.email ?? ''
    );
  }
}
