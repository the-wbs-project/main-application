import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDiagramSubtask } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { SaveMessageComponent } from '@wbs/components/save-message.component';
import {
  EntryTaskService,
  SaveService,
  TitleService,
} from '@wbs/core/services';
import { NavigationComponent } from '@wbs/main/components/navigation.component';
import { TaskModalFooterComponent } from '@wbs/main/components/task-modal-footer.component';
import { NavigationMenuService, TaskModalService } from '@wbs/main/services';
import { EntryTitleComponent } from './components/entry-title';
import { TASK_NAVIGATION } from './models';
import { EntryStore } from '@wbs/store';

@Component({
  standalone: true,
  templateUrl: './view-task.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogModule,
    EntryTitleComponent,
    FontAwesomeModule,
    NavigationComponent,
    RouterModule,
    SaveMessageComponent,
    TaskModalFooterComponent,
    TranslateModule,
  ],
  providers: [TaskModalService],
})
export class TaskViewComponent {
  readonly modal = inject(TaskModalService);
  private readonly navService = inject(NavigationMenuService);
  private readonly store = inject(Store);
  private readonly taskService = inject(EntryTaskService);
  readonly entryStore = inject(EntryStore);

  readonly claims = input.required<string[]>();
  readonly entryUrl = input.required<string[]>();
  readonly taskId = input.required<string>();
  readonly titleSave = new SaveService();

  readonly links = computed(() =>
    this.navService.processLinks(TASK_NAVIGATION, this.claims())
  );
  readonly task = computed(() =>
    this.entryStore.viewModels()?.find((t) => t.id === this.taskId())
  );

  readonly faDiagramSubtask = faDiagramSubtask;

  constructor(title: TitleService) {
    title.setTitle(['Project']);
  }

  navigate(route: string[]) {
    this.store.dispatch(
      new Navigate([...this.entryUrl(), 'tasks', this.task()!.id, ...route])
    );
  }

  titleChanged(title: string): void {
    this.titleSave
      .call(this.taskService.titleChangedAsync(this.task()!.id, title))
      .subscribe();
  }

  closed(): void {
    this.store.dispatch(new Navigate([...this.entryUrl(), 'tasks']));
  }
}
