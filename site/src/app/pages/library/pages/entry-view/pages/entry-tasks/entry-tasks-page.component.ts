import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { HeightDirective } from '@wbs/core/directives/height.directive';
import { SignalStore } from '@wbs/core/services';
import { EntryStore } from '@wbs/core/store';
import { LibraryTreeComponent } from './components';

@Component({
  standalone: true,
  templateUrl: './entry-tasks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogModule,
    LibraryTreeComponent,
    FontAwesomeModule,
    RouterModule,
    TranslateModule,
    HeightDirective,
  ],
})
export class TasksPageComponent {
  private readonly store = inject(SignalStore);
  private readonly entryStore = inject(EntryStore);

  readonly faSpinner = faSpinner;
  readonly showDialog = signal(false);
  readonly containerHeight = signal(100);
  readonly dialogContainerHeight = signal(100);
  readonly entryUrl = input.required<string[]>();
  readonly isLoading = computed(() => !this.entryStore.version());

  navigateToTask(taskId: string): void {
    this.store.dispatch(new Navigate([...this.entryUrl(), 'tasks', taskId]));
  }
}
