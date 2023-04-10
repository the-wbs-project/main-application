import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { UsersState } from '@wbs/core/states';

@Pipe({ name: 'userName' })
export class UserNamePipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(userId: string | undefined | null): string {
    if (!userId) return '';

    return (
      this.store.selectSnapshot(UsersState.usersById).get(userId)?.name ?? ''
    );
  }
}
