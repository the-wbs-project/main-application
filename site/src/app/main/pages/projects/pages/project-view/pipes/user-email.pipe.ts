import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { OrganizationState } from '@wbs/core/states';

@Pipe({ name: 'userEmail', standalone: true })
export class UserEmailPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(userId: string | undefined | null): string {
    if (!userId) return '';

    return (
      this.store.selectSnapshot(OrganizationState.usersById).get(userId)
        ?.email ?? ''
    );
  }
}
