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
import { LIBRARY_CLAIMS, ListItem } from '@wbs/core/models';
import { Messages, SignalStore } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { LibraryTreeComponent } from './components/library-tree';
import { TaskModalComponent } from './components/task-modal';
import { EntryViewState } from '../../states';
import {
  EntryTaskActionService,
  EntryTaskRecorderService,
  EntryTreeMenuService,
} from '../../services';
import { Transformers } from '@wbs/main/services';
import {
  faChevronsLeft,
  faChevronsRight,
} from '@fortawesome/pro-solid-svg-icons';

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
  readonly phases = input.required<ListItem[]>();

  readonly entry = this.store.select(EntryViewState.entry);
  readonly version = this.store.select(EntryViewState.version);
  readonly tasks = this.store.select(EntryViewState.tasks);

  readonly isLoading = computed(() => !this.entry() || !this.version());
}
