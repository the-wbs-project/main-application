import { Pipe, PipeTransform } from '@angular/core';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { RESOURCE_TYPE_TYPE } from '@wbs/core/models';

@Pipe({ name: 'restrictions', standalone: true })
export class RestrictionsPipe implements PipeTransform {
  transform(type: RESOURCE_TYPE_TYPE): FileRestrictions {
    return {
      allowedExtensions:
        type === 'pdf'
          ? ['.pdf']
          : type === 'image'
          ? ['.jpg', 'jpeg', '.png']
          : undefined,
    };
  }
}
