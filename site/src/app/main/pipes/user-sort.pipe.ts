import { Pipe, PipeTransform } from '@angular/core';
import { UserLite } from '@wbs/core/models';

@Pipe({ name: 'userSort', standalone: true })
export class UserSortPipe implements PipeTransform {
  transform(
    users: UserLite[] | null | undefined
  ): UserLite[] | null | undefined {
    if (!users) return users;

    return users.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
  }
}
