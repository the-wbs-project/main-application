import { Pipe, PipeTransform } from '@angular/core';
import { RESOURCE_TYPE_TYPE } from '@wbs/core/models';

@Pipe({ name: 'resourceTypeDownloadable', standalone: true })
export class ResourceTypeDownloadablePipe implements PipeTransform {
  transform(type: RESOURCE_TYPE_TYPE): boolean {
    return type === 'pdf' || type === 'file';
  }
}
