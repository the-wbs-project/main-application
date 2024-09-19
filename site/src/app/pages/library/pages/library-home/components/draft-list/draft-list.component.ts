import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LibraryTypeTextComponent } from '@wbs/components/_utils/library-type-text.component';
import { LoadingComponent } from '@wbs/components/_utils/loading.component';
import { LibraryDraftViewModel } from '@wbs/core/view-models';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
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
    LibraryTypeTextComponent,
    LoadingComponent,
    RouterModule,
    TranslateModule,
    VersionPipe,
  ],
})
export class LibraryDraftListComponent {
  readonly showLoading = input(false);
  readonly entries = input.required<LibraryDraftViewModel[]>();
  readonly selected = output<LibraryDraftViewModel>();
}
