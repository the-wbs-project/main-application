import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { OrganizationState } from '@wbs/core/states';

@Pipe({ name: 'userName', pure: true, standalone: true })
export class UserNamePipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(userId: string | null | undefined): string | null | undefined {
    if (!userId) return undefined;

    return this.store.selectSnapshot(OrganizationState.usersById).get(userId)
      ?.name;
  }
}
