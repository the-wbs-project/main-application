import { Pipe, PipeTransform } from '@angular/core';
import { PermissionFilter } from '@wbs/core/models';
import { ProjectPermissionsService } from '../services';

@Pipe({ name: 'check', standalone: true })
export class CheckPipe implements PipeTransform {
  constructor(private readonly service: ProjectPermissionsService) {}

  transform(
    permissions: Map<string, boolean> | undefined,
    filter: string | PermissionFilter | undefined
  ): boolean {
    if (!permissions || !filter) return false;

    return this.service.check(permissions, filter);
  }
}
