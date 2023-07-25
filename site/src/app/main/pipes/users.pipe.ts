import { Pipe, PipeTransform } from '@angular/core';
import { UserLite } from '@wbs/core/models';

@Pipe({ name: 'users', standalone: true })
export class UsersPipe implements PipeTransform {
  transform(
    userIds: string[] | null | undefined,
    lookup: Map<string, UserLite> | UserLite[] | null | undefined
  ): UserLite[] {
    if (!userIds || !lookup) return [];

    const users: UserLite[] = [];

    for (const id of userIds) {
      const current = Array.isArray(lookup)
        ? lookup.find((x) => x.id === id)
        : lookup.get(id);

      if (current) users.push(current);
    }

    return users;
  }
}
