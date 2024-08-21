import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleQuestion } from '@fortawesome/pro-duotone-svg-icons';
import { faSquare } from '@fortawesome/pro-light-svg-icons';
import { faBars, faEllipsisH } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from '@progress/kendo-angular-tooltip';

@Component({
  standalone: true,
  selector: 'wbs-library-tree-title-legend',
  templateUrl: './library-tree-title-legend.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, PopoverModule, TranslateModule],
})
export class LibraryTreeTitleLegendComponent {
  readonly infoIcon = faCircleQuestion;
  readonly reorderIcon = faBars;
  readonly menuIcon = faEllipsisH;
  readonly squareIcon = faSquare;
  readonly canEdit = input.required<boolean>();
  readonly visibility = input.required<string | undefined>();
}
