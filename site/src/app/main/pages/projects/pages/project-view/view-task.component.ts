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
import { SignalStore, TitleService } from '@wbs/core/services';
import { NavigationComponent } from '@wbs/main/components/navigation.component';
import { TaskModalFooterComponent } from '@wbs/main/components/task-modal-footer.component';
import { NavigationMenuService, TaskModalService } from '@wbs/main/services';
import { TASK_NAVIGATION } from './models';
import { ProjectTitleComponent } from './components/project-title';
import { ProjectApprovalState, ProjectState, TasksState } from './states';
import { ApprovalBadgeComponent } from '@wbs/main/components/approval-badge.component';
import { FindByIdPipe } from '@wbs/main/pipes/find-by-id.pipe';
import { PageHeaderComponent } from '@wbs/main/components/page-header';
import { ProjectApprovalWindowComponent } from './components/project-approval-window';

@Component({
  standalone: true,
  templateUrl: './view-task.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApprovalBadgeComponent,
    DialogModule,
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
  readonly links = computed(() =>
    this.navService.processLinks(TASK_NAVIGATION, this.claims())
  );
  readonly task = computed(() =>
    this.tasks()?.find((t) => t.id === this.taskId())
  );

  readonly faDiagramSubtask = faDiagramSubtask;

  constructor(title: TitleService) {
    title.setTitle('Project', false);
  }

  navigate(route: string[]) {
    this.store.dispatch(
      new Navigate([...this.projectUrl(), 'tasks', this.task()!.id, ...route])
    );
  }

  titleChanged(title: string): void {
    //  this.taskService.titleChangedAsync(this.task()!.id, title).subscribe();
  }

  closed(): void {
    this.store.dispatch(new Navigate([...this.projectUrl(), 'tasks']));
  }
}
