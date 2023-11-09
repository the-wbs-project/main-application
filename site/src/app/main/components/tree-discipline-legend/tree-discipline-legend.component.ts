import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleQuestion } from '@fortawesome/pro-duotone-svg-icons';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ListItem } from '@wbs/core/models';
import { CategoryLabelPipe } from '@wbs/main/pipes/category-label.pipe';
import { DisciplineIconPipe } from '@wbs/main/pipes/discipline-icon.pipe';

@Component({
  standalone: true,
  selector: 'wbs-tree-discipline-legend',
  templateUrl: './tree-discipline-legend.component.html',
  styleUrls: ['./tree-discipline-legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CategoryLabelPipe,
    DisciplineIconPipe,
    FontAwesomeModule,
    NgbPopoverModule,
    NgClass,
    NgFor,
    NgIf,
    TranslateModule,
  ],
})
export class TreeDisciplineLegendComponent {
  @Input() idsOrCats: (string | ListItem)[] | null | undefined;

  readonly faCircleQuestion = faCircleQuestion;
}
