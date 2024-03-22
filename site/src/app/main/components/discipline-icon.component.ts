import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { ProjectCategory } from '@wbs/core/models';
import { DisciplineIconPipe } from '@wbs/main/pipes/discipline-icon.pipe';
import { DisciplineLabelPipe } from '@wbs/main/pipes/discipline-label.pipe';

@Component({
  standalone: true,
  selector: 'wbs-discipline-icon',
  template: `<span
    class="mg-r-5"
    kendoTooltip
    [title]="id() | disciplineLabel : fullList() | translate"
  >
    <fa-icon [icon]="id() | disciplineIcon : fullList()" size="sm" />
  </span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DisciplineIconPipe,
    DisciplineLabelPipe,
    FontAwesomeModule,
    TooltipModule,
    TranslateModule,
  ],
})
export class DisciplineIconComponent {
  readonly id = input.required<string>();
  readonly fullList = input<ProjectCategory[]>();
}
