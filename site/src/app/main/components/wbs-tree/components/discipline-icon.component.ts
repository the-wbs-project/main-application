import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoryLabelPipe } from '@wbs/main/pipes/category-label.pipe';
import { DisciplineIconPipe } from '@wbs/main/pipes/discipline-icon.pipe';

@Component({
  standalone: true,
  selector: 'wbs-discipline-icon',
  template: `<span
    class="mg-r-5"
    [ngbTooltip]="id | categoryLabel"
    placement="top"
    container="body"
  >
    <i class="fa-solid fa-sm" [ngClass]="[id | disciplineIcon]"></i>
  </span>`,
  imports: [
    CategoryLabelPipe,
    CommonModule,
    DisciplineIconPipe,
    NgbTooltipModule,
  ],
})
export class DisciplineIconComponent {
  @Input() id: string | undefined;
}
