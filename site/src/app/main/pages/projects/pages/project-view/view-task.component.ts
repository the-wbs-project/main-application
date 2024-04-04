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
import { faCheck, faDiagramSubtask } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { SaveState } from '@wbs/core/models';
import { SignalStore, TitleService } from '@wbs/core/services';
import { ApprovalBadgeComponent } from '@wbs/main/components/approval-badge.component';
import { FadingMessageComponent } from '@wbs/main/components/fading-message.component';
import { NavigationComponent } from '@wbs/main/components/navigation.component';
import { PageHeaderComponent } from '@wbs/main/components/page-header';
import { TaskModalFooterComponent } from '@wbs/main/components/task-modal-footer.component';
import { FindByIdPipe } from '@wbs/main/pipes/find-by-id.pipe';
import { NavigationMenuService, TaskModalService } from '@wbs/main/services';
import { delay, tap } from 'rxjs/operators';
import { ChangeTaskBasics } from './actions';
import { ProjectApprovalWindowComponent } from './components/project-approval-window';
import { ProjectTitleComponent } from './components/project-title';
import { TASK_NAVIGATION } from './models';
import { ProjectApprovalState, ProjectState, TasksState } from './states';

@Component({
  standalone: true,
  templateUrl: './view-task.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApprovalBadgeComponent,
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
  readonly claims = input.required<string[]>();
  readonly projectUrl = input.required<string[]>();
  readonly taskId = input.required<string>();
  readonly userId = input.required<string>();

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
    this.navService.processLinks(TASK_NAVIGATION, this.claims())
  );
  readonly task = computed(() =>
    this.tasks()?.find((t) => t.id === this.taskId())
  );

  readonly checkIcon = faCheck;
  readonly taskIcon = faDiagramSubtask;

  constructor(title: TitleService) {
    title.setTitle('Project', false);
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
      .dispatch(new ChangeTaskBasics(title, task.description ?? ''))
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
