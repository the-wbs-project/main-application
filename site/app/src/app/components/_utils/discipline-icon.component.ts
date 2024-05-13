import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { ProjectCategory } from '@wbs/core/models';
import { DisciplineIconPipe } from '@wbs/pipes/discipline-icon.pipe';
import { DisciplineLabelPipe } from '@wbs/pipes/discipline-label.pipe';

@Component({
  standalone: true,
  selector: 'wbs-discipline-icon',
  template: `<span
    class="mg-r-5"
    kendoTooltip
    [title]="id() | disciplineLabel : fullList()"
  >
    <i
      class="fa-solid fa-sm"
      [ngClass]="id() | disciplineIcon : fullList()"
    ></i>
  </span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineIconPipe, DisciplineLabelPipe, NgClass, TooltipModule],
})
export class DisciplineIconComponent {
  readonly id = input.required<string>();
  readonly fullList = input<ProjectCategory[]>();
}
