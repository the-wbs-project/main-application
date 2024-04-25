import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { SignalStore } from '@wbs/core/services';
import { LibraryTreeComponent } from '../../components/library-tree';
import { EntryState } from '../../services';

@Component({
  standalone: true,
  templateUrl: './entry-tasks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FontAwesomeModule,
    LibraryTreeComponent,
    RouterModule,
    TranslateModule,
  ],
})
export class TasksPageComponent {
  readonly state = inject(EntryState);

  readonly faSpinner = faSpinner;

  readonly claims = input.required<string[]>();
  readonly entryUrl = input.required<string[]>();

  readonly isLoading = computed(
    () => !this.state.entry() || !this.state.version()
  );
}
