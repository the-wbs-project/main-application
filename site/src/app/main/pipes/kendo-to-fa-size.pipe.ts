import { Pipe, PipeTransform } from '@angular/core';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { ButtonSize } from '@progress/kendo-angular-buttons';

@Pipe({ name: 'kendoToFaSize', standalone: true })
export class KendoToFaSizePipe implements PipeTransform {
  transform(size: ButtonSize): SizeProp {
    if (size === 'small') return 'xs';
    if (size === 'medium') return 'sm';
    if (size === 'large') return 'lg';
    return 'lg';
  }
}
