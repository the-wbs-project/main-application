import { Pipe, PipeTransform } from '@angular/core';
import { UserLite } from '@wbs/core/models';
import { sorter } from '@wbs/core/services';

@Pipe({ name: 'userSort', standalone: true })
export class UserSortPipe implements PipeTransform {
  transform(
    users: UserLite[] | null | undefined
  ): UserLite[] | null | undefined {
    if (!users) return users;

    return users.sort((a, b) => sorter(a.name, b.name));
  }
}
