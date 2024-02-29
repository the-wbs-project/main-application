import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDiagramSubtask } from '@fortawesome/pro-solid-svg-icons';
import { SignalStore, TitleService } from '@wbs/core/services';
import { NavigationComponent } from '@wbs/main/components/navigation.component';
import { FindByIdPipe } from '@wbs/main/pipes/find-by-id.pipe';
import { NavigationMenuService } from '@wbs/main/services';
import { ApprovalBadgeComponent } from '../../components/approval-badge.component';
import { ProjectApprovalWindowComponent } from '../../components/project-approval-window/project-approval-window.component';
import { TASK_NAVIGATION } from '../../models';
import { ProjectNavigationService } from '../../services';
import { ProjectApprovalState, ProjectState, TasksState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './task-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ApprovalBadgeComponent,
    FindByIdPipe,
    FontAwesomeModule,
    NavigationComponent,
    ProjectApprovalWindowComponent,
    RouterModule,
  ],
})
export class TaskViewComponent {
  private readonly navService = inject(NavigationMenuService);
  private readonly projectNavService = inject(ProjectNavigationService);
  private readonly store = inject(SignalStore);

  readonly claims = input.required<string[]>();
  readonly userId = input.required<string>();
  readonly current = this.store.select(TasksState.current);
  readonly project = this.store.select(ProjectState.current);
  readonly approval = this.store.select(ProjectApprovalState.current);
  readonly approvals = this.store.select(ProjectApprovalState.list);
  readonly approvalView = this.store.select(ProjectApprovalState.view);
  readonly approvalHasChildren = this.store.select(
    ProjectApprovalState.hasChildren
  );
  readonly chat = this.store.select(ProjectApprovalState.messages);
  readonly links = computed(() =>
    this.navService.processLinks(TASK_NAVIGATION, this.claims())
  );
  readonly faDiagramSubtask = faDiagramSubtask;

  constructor(title: TitleService) {
    title.setTitle('Project', false);
  }

  navigate(route: string[]) {
    this.projectNavService.toTaskPage(this.current()!.id, ...route);
  }
}
