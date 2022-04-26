import { Component, Input } from '@angular/core';

@Component({
  selector: 'wbs-discipline-icon',
  template: ` <span
    class="discipline-icon"
    kendoTooltip
    filter="span"
    [title]="id | categoryLabel"
  >
    <fa-icon [icon]="id | disciplineIcon"></fa-icon>
  </span>`,
  styles: ['.discipline-icon { margin-right: 10px; }'],
  preserveWhitespaces: false,
})
export class DisciplineIconComponent {
  @Input() id: string | undefined;
}
