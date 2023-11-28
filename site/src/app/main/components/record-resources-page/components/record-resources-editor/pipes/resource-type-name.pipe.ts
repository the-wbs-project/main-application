import { Pipe, PipeTransform } from '@angular/core';
import { RESOURCE_TYPE_TYPE } from '@wbs/core/models';

@Pipe({ name: 'resourceTypeName', standalone: true })
export class ResourceTypeNamePipe implements PipeTransform {
  transform(type: RESOURCE_TYPE_TYPE): string {
    if (type === 'link') return 'General.Link';
    if (type === 'pdf') return 'General.Pdf';
    if (type === 'file') return 'General.File';
    if (type === 'image') return 'General.Image';
    if (type === 'youtube') return 'General.Video';

    return '';
  }
}
