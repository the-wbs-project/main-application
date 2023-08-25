import { Pipe, PipeTransform } from '@angular/core';
import { sorter } from '@wbs/core/services';

@Pipe({ name: 'userSort', standalone: true })
export class UserSortPipe implements PipeTransform {
  transform<T extends { name: string }>(
    users: T[] | null | undefined
  ): T[] | null | undefined {
    if (!users) return users;

    return users.sort((a, b) => sorter(a.name, b.name));
  }
}
