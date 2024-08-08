import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleQuestion } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from '@progress/kendo-angular-tooltip';
import { DisciplineSplitListComponent } from '@wbs/components/_utils/discipline-split-list.component';
import { CategoryViewModel } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-tree-discipline-legend',
  templateUrl: './tree-discipline-legend.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DisciplineSplitListComponent,
    FontAwesomeModule,
    PopoverModule,
    TranslateModule,
  ],
})
export class TreeDisciplineLegendComponent {
  readonly faCircleQuestion = faCircleQuestion;
  readonly list = input.required<CategoryViewModel[]>();
}
