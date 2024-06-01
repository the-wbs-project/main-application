import { Pipe, PipeTransform } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faFile,
  faFilePdf,
  faImage,
  faLink,
  faVideo,
} from '@fortawesome/pro-solid-svg-icons';
import { RESOURCE_TYPE_TYPE } from '@wbs/core/models';

@Pipe({ name: 'resourceTypeIcon', standalone: true })
export class ResourceTypeIconPipe implements PipeTransform {
  transform(type: RESOURCE_TYPE_TYPE): IconDefinition | undefined {
    if (type === 'link') return faLink;
    if (type === 'pdf') return faFilePdf;
    if (type === 'file') return faFile;
    if (type === 'image') return faImage;
    if (type === 'youtube') return faVideo;
    return undefined;
  }
}
