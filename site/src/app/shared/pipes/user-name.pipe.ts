import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { OrganizationState } from '@wbs/shared/states';

@Pipe({ name: 'userName', pure: false })
export class UserNamePipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(userId: string | null | undefined): string | undefined {
    if (!userId) return undefined;

    return this.store
      .selectSnapshot(OrganizationState.users)
      ?.find((x) => x.id === userId)?.name;
  }
}
