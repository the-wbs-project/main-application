import { Component, Input } from '@angular/core';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'wbs-discipline-icon',
  template: ` <span
    class="mg-r-10"
    kendoTooltip
    filter="span"
    [title]="id | categoryLabel"
  >
    <fa-icon [size]="size" [icon]="id | disciplineIcon"></fa-icon>
  </span>`,
})
export class DisciplineIconComponent {
  @Input() size: SizeProp = '1x';
  @Input() id: string | undefined;
}
