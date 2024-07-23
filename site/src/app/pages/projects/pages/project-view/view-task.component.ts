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
import {
  faCheck,
  faDiagramSubtask,
  faX,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { PROJECT_STATI, SaveState } from '@wbs/core/models';
import {
  NavigationMenuService,
  SignalStore,
  TitleService,
  TaskModalService,
} from '@wbs/core/services';
import { ApprovalBadgeComponent } from '@wbs/components/_utils/approval-badge.component';
import { FadingMessageComponent } from '@wbs/components/_utils/fading-message.component';
import { NavigationComponent } from '@wbs/components/_utils/navigation.component';
import { TaskModalFooterComponent } from '@wbs/components/_utils/task-modal-footer.component';
import { PageHeaderComponent } from '@wbs/components/page-header';
import { FindByIdPipe } from '@wbs/pipes/find-by-id.pipe';
import { delay, tap } from 'rxjs/operators';
import { ChangeTaskBasics } from './actions';
import { ProjectApprovalWindowComponent } from './components/project-approval-window';
import { ProjectTitleComponent } from './components/project-title';
import { TASK_NAVIGATION } from './models';
import { ProjectApprovalState, ProjectState, TasksState } from './states';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  templateUrl: './view-task.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApprovalBadgeComponent,
    ButtonModule,
    DialogModule,
    FadingMessageComponent,
    FindByIdPipe,
    FontAwesomeModule,
    NavigationComponent,
    PageHeaderComponent,
    ProjectApprovalWindowComponent,
    ProjectTitleComponent,
    RouterModule,
    TaskModalFooterComponent,
    TranslateModule,
  ],
  providers: [TaskModalService],
})
export class TaskViewComponent {
  readonly modal = inject(TaskModalService);
  private readonly navService = inject(NavigationMenuService);
  private readonly store = inject(SignalStore);
  private readonly tasks = this.store.select(TasksState.phases);
  //
  //  IO
  //
  readonly projectUrl = input.required<string[]>();
  readonly taskId = input.required<string>();
  readonly userId = input.required<string>();

  readonly claims = this.store.select(ProjectState.claims);
  readonly project = this.store.select(ProjectState.current);
  readonly navSection = this.store.select(TasksState.navSection);
  readonly approval = this.store.select(ProjectApprovalState.current);
  readonly approvals = this.store.select(ProjectApprovalState.list);
  readonly approvalEnabled = this.store.select(ProjectApprovalState.enabled);
  readonly approvalView = this.store.select(ProjectApprovalState.view);
  readonly approvalHasChildren = this.store.select(
    ProjectApprovalState.hasChildren
  );
  readonly chat = this.store.select(ProjectApprovalState.messages);
  readonly titleSaveState = signal<SaveState>('ready');
  readonly links = computed(() =>
    this.navService.processLinks(
      TASK_NAVIGATION,
      this.project()?.status === PROJECT_STATI.PLANNING,
      this.claims() ?? []
    )
  );
  readonly task = computed(() =>
    this.tasks()?.find((t) => t.id === this.taskId())
  );

  readonly closeIcon = faX;
  readonly checkIcon = faCheck;
  readonly taskIcon = faDiagramSubtask;

  constructor(title: TitleService) {
    title.setTitle(['Project']);
  }

  navigate(route: string[]) {
    this.store.dispatch(
      new Navigate([...this.projectUrl(), 'tasks', this.task()!.id, ...route])
    );
  }

  titleChanged(title: string): void {
    this.titleSaveState.set('saving');
    const task = this.task()!;

    this.store
      .dispatch(
        new ChangeTaskBasics(
          task.id,
          title,
          task.description ?? '',
          task.absFlag === 'set'
        )
      )
      .pipe(
        delay(500),
        tap(() => this.titleSaveState.set('saved')),
        delay(5000)
      )
      .subscribe(() => this.titleSaveState.set('ready'));
  }

  closed(): void {
    this.store.dispatch(new Navigate([...this.projectUrl(), 'tasks']));
  }
}
