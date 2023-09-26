import { Pipe, PipeTransform } from '@angular/core';
import { IconDefinition } from '@fortawesome/pro-regular-svg-icons';
import { SVGIcon } from '@progress/kendo-svg-icons';
import { faToKendo } from '../services';

@Pipe({ name: 'faToKendo', standalone: true })
export class FaToKendoPipe implements PipeTransform {
  transform(icon: IconDefinition): SVGIcon {
    return faToKendo(icon);
  }
}
