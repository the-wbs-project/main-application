import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleQuestion } from '@fortawesome/pro-duotone-svg-icons';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectCategory } from '@wbs/core/models';
import { DisciplineIconPipe } from '@wbs/main/pipes/discipline-icon.pipe';
import { DisciplineLabelPipe } from '@wbs/main/pipes/discipline-label.pipe';

@Component({
  standalone: true,
  selector: 'wbs-tree-discipline-legend',
  templateUrl: './tree-discipline-legend.component.html',
  styleUrls: ['./tree-discipline-legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DisciplineIconPipe,
    DisciplineLabelPipe,
    FontAwesomeModule,
    NgbPopoverModule,
    NgClass,
    TranslateModule,
  ],
})
export class TreeDisciplineLegendComponent {
  readonly idsOrCats = input<ProjectCategory[] | undefined>();

  readonly faCircleQuestion = faCircleQuestion;
}
