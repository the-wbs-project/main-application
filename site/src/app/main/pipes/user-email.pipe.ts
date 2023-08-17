import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { MembershipState } from '@wbs/main/states';

@Pipe({ name: 'userEmail', standalone: true })
export class UserEmailPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(userId: string | undefined | null): string | undefined {
    if (!userId) return '';

    return this.store
      .selectSnapshot(MembershipState.members)
      ?.find((x) => x.id === userId)?.email;
  }
}
