import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleQuestion } from '@fortawesome/pro-duotone-svg-icons';
import { faSquare } from '@fortawesome/pro-light-svg-icons';
import { faEllipsisH, faPencil } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from '@progress/kendo-angular-tooltip';

@Component({
  standalone: true,
  selector: 'wbs-phase-tree-title-legend',
  templateUrl: './phase-tree-title-legend.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, PopoverModule, TranslateModule],
})
export class PhaseTreeTitleLegendComponent {
  readonly infoIcon = faCircleQuestion;
  readonly editIcon = faPencil;
  readonly menuIcon = faEllipsisH;
  readonly squareIcon = faSquare;
  readonly canEdit = input.required<boolean>();
}
