import { Component, Input } from '@angular/core';

@Component({
  selector: 'wbs-discipline-icon',
  template: `<span
    class="mg-r-5"
    [ngbTooltip]="id | categoryLabel"
    placement="top"
    container="body"
  >
    <i class="fa-solid fa-sm" [ngClass]="[id | disciplineIcon]"></i>
  </span>`,
})
export class DisciplineIconComponent {
  @Input() id: string | undefined;
}
