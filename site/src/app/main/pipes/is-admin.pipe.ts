import { Pipe, PipeTransform } from '@angular/core';
import { ROLES } from '@wbs/core/models';

@Pipe({ name: 'isAdmin', standalone: true })
export class iIsAdminPipe implements PipeTransform {
  transform(roles: string[] | null | undefined): boolean {
    return roles?.includes(ROLES.ADMIN) ?? false;
  }
}
