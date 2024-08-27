import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { LibraryDraftViewModel } from '@wbs/core/view-models';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { EntryTypeIconPipe } from '@wbs/pipes/entry-type-icon.pipe';
import { EntryTypeTitlePipe } from '@wbs/pipes/entry-type-title.pipe';
import { VersionPipe } from '@wbs/pipes/version.pipe';

@Component({
  standalone: true,
  selector: 'wbs-library-draft-list',
  templateUrl: './draft-list.component.html',
  styleUrl: './draft-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block overflow-auto flex-fill' },
  imports: [
    DateTextPipe,
    EntryTypeIconPipe,
    EntryTypeTitlePipe,
    FontAwesomeModule,
    RouterModule,
    TranslateModule,
    VersionPipe,
  ],
})
export class LibraryDraftListComponent {
  readonly loadingIcon = faSpinner;
  readonly showLoading = input(false);
  readonly entries = input.required<LibraryDraftViewModel[]>();
  readonly selected = output<LibraryDraftViewModel>();
}
