import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { OrganizationState } from '@wbs/shared/states';

@Pipe({ name: 'userEmail' })
export class UserEmailPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(userId: string | undefined | null): string {
    if (!userId) return '';

    const user = this.store
      .selectSnapshot(OrganizationState.users)
      .find((x) => x.id === userId);

    return user?.email ?? '';
  }
}
