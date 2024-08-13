import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { VisibilityTextComponent } from '@wbs/components/_utils/visibility-text.component';
import { UserComponent } from '@wbs/components/user';
import { EntryStore } from '@wbs/core/store';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { EntryTypeTitlePipe } from '@wbs/pipes/entry-type-title.pipe';
import { LibraryStatusPipe } from '@wbs/pipes/library-status.pipe';
import { VersionEditorComponent } from '../version-editor';

@Component({
  standalone: true,
  selector: 'wbs-details-card',
  templateUrl: './details-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card dashboard-card' },
  imports: [
    DateTextPipe,
    EntryTypeTitlePipe,
    LibraryStatusPipe,
    TranslateModule,
    UserComponent,
    VersionEditorComponent,
    VisibilityTextComponent,
  ],
})
export class DetailsCardComponent {
  readonly store = inject(EntryStore);
  readonly editAlias = signal(false);
}
