import { Component, Input } from '@angular/core';

@Component({
  selector: 'wbs-discipline-icon',
  template: ` <span
    class="mg-r-10"
    kendoTooltip
    filter="span"
    [title]="id | categoryLabel"
  >
    <i class="fa-solid fa-1x" [ngClass]="[id | disciplineIcon]"></i>
  </span>`,
})
export class DisciplineIconComponent {
  @Input() id: string | undefined;
}
