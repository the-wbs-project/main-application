import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { SignalStore } from '@wbs/core/services';
import { UiState } from '@wbs/main/states';
import { LibraryTreeComponent } from '../../components/library-tree';
import { EntryViewState } from '../../states';
import { TaskModalComponent } from './components/task-modal';

@Component({
  standalone: true,
  templateUrl: './tasks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FontAwesomeModule,
    LibraryTreeComponent,
    TaskModalComponent,
    TranslateModule,
  ],
})
export class TasksPageComponent {
  private readonly store = inject(SignalStore);

  readonly faSpinner = faSpinner;

  readonly claims = input.required<string[]>();
  readonly entryUrl = input.required<string[]>();

  readonly entry = this.store.select(EntryViewState.entry);
  readonly version = this.store.select(EntryViewState.version);
  readonly tasks = this.store.select(EntryViewState.tasks);
  readonly width = this.store.select(UiState.mainContentWidth);

  readonly isLoading = computed(() => !this.entry() || !this.version());
}
