import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDiagramSubtask } from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { TitleService } from '@wbs/core/services';
import { NavigationComponent } from '@wbs/main/components/navigation.component';
import { FindByIdPipe } from '@wbs/main/pipes/find-by-id.pipe';
import { NavMenuProcessPipe } from '@wbs/main/pipes/nav-menu-process.pipe';
import { ApprovalBadgeComponent } from '../../components/approval-badge.component';
import { ProjectApprovalWindowComponent } from '../../components/project-approval-window/project-approval-window.component';
import { TASK_NAVIGATION } from '../../models';
import { ProjectNavigationService } from '../../services';
import { ProjectApprovalState, ProjectState, TasksState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ApprovalBadgeComponent,
    FindByIdPipe,
    FontAwesomeModule,
    NavigationComponent,
    NavMenuProcessPipe,
    ProjectApprovalWindowComponent,
    RouterModule,
  ],
})
export class TaskViewComponent {
  @Input({ required: true }) claims!: string[];
  @Input({ required: true }) userId!: string;

  readonly current = toSignal(this.store.select(TasksState.current));
  readonly project = toSignal(this.store.select(ProjectState.current));
  readonly approval = toSignal(this.store.select(ProjectApprovalState.current));
  readonly approvals = toSignal(this.store.select(ProjectApprovalState.list));
  readonly approvalView = toSignal(
    this.store.select(ProjectApprovalState.view)
  );
  readonly approvalHasChildren = toSignal(
    this.store.select(ProjectApprovalState.hasChildren)
  );
  readonly chat = toSignal(this.store.select(ProjectApprovalState.messages));
  readonly links = TASK_NAVIGATION;
  readonly faDiagramSubtask = faDiagramSubtask;

  constructor(
    title: TitleService,
    private readonly nav: ProjectNavigationService,
    private readonly store: Store
  ) {
    title.setTitle('Project', false);
  }

  navigate(route: string[]) {
    this.nav.toTaskPage(this.current()!.id, ...route);
  }
}
