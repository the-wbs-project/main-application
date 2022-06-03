import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@wbs/shared/models';

@Pipe({ name: 'userFilter', pure: false })
export class UserFilterPipe implements PipeTransform {
  transform(
    users: User[] | undefined | null,
    blocked: boolean
  ): User[] | undefined | null {
    return users?.filter((x) => x.blocked === blocked);
  }
}
