import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { WatchIndicatorComponent } from '@wbs/components/watch-indicator.component';
import { LibraryViewModel } from '@wbs/core/view-models';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { EntryTypeIconPipe } from '@wbs/pipes/entry-type-icon.pipe';
import { EntryTypeTitlePipe } from '@wbs/pipes/entry-type-title.pipe';

@Component({
  standalone: true,
  selector: 'wbs-library-list',
  templateUrl: './library-list.component.html',
  styleUrl: './library-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block overflow-auto flex-fill' },
  imports: [
    DateTextPipe,
    EntryTypeIconPipe,
    EntryTypeTitlePipe,
    FontAwesomeModule,
    NgClass,
    RouterModule,
    TooltipModule,
    TranslateModule,
    WatchIndicatorComponent,
  ],
})
export class LibraryListComponent {
  readonly loadingIcon = faSpinner;
  readonly showLoading = input(false);
  readonly showWatchedColumn = input(true);
  readonly selected = model<LibraryViewModel | undefined>(undefined);
  readonly entries = input.required<LibraryViewModel[]>();
  readonly showOwner = input(false);
  readonly dblClick = output<void>();
}
