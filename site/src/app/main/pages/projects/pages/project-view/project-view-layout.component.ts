import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { faArrowUpFromBracket, faX } from '@fortawesome/pro-solid-svg-icons';
import { gearIcon } from '@progress/kendo-svg-icons';
import { SignalStore, TitleService } from '@wbs/core/services';
import { ActionIconListComponent } from '@wbs/main/components/action-icon-list.component';
import { PageHeaderComponent } from '@wbs/main/components/page-header/page-header.component';
import { FindByIdPipe } from '@wbs/main/pipes/find-by-id.pipe';
import { ProjectTitleComponent } from '../../components/project-title.component';
import { ApprovalBadgeComponent } from './components/approval-badge.component';
import { ProjectActionButtonComponent } from './components/project-action-button/project-action-button.component';
import { ProjectApprovalWindowComponent } from './components/project-approval-window/project-approval-window.component';
import { ProjectChecklistModalComponent } from './components/project-checklist-modal/project-checklist-modal.component';
import { ProjectNavigationComponent } from './components/project-navigation.component';
import { PROJECT_NAVIGATION } from './models';
import { NavMenuProcessPipe } from './pipes/nav-menu-process.pipe';
import { ProjectApprovalState, ProjectState } from './states';
import { ProjectNavigationService } from './services';

@Component({
  standalone: true,
  templateUrl: './project-view-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ActionIconListComponent,
    ApprovalBadgeComponent,
    FindByIdPipe,
    NavMenuProcessPipe,
    PageHeaderComponent,
    ProjectActionButtonComponent,
    ProjectApprovalWindowComponent,
    ProjectChecklistModalComponent,
    ProjectNavigationComponent,
    ProjectTitleComponent,
    RouterModule,
  ],
})
export class ProjectViewLayoutComponent {
  readonly claims = input.required<string[]>();
  readonly userId = input.required<string>();

  readonly approvalEnabled = this.store.select(ProjectApprovalState.enabled);
  readonly approval = this.store.select(ProjectApprovalState.current);
  readonly approvals = this.store.select(ProjectApprovalState.list);
  readonly approvalView = this.store.select(ProjectApprovalState.view);
  readonly showApproval = computed(
    () => this.approvalView() === 'project' && this.approval() != undefined
  );
  readonly approvalHasChildren = this.store.select(
    ProjectApprovalState.hasChildren
  );
  readonly chat = this.store.select(ProjectApprovalState.messages);
  readonly project = this.store.select(ProjectState.current);
  readonly category = computed(() => this.project()?.category);
  readonly title = computed(() => this.project()?.title);

  readonly links = PROJECT_NAVIGATION;
  readonly faArrowUpFromBracket = faArrowUpFromBracket;
  readonly faX = faX;
  readonly gearIcon = gearIcon;
  readonly menu = [
    {
      text: 'Projects.SubmitForApproval',
      icon: faArrowUpFromBracket,
      action: 'submitForApproval',
    },
  ];

  constructor(
    title: TitleService,
    private readonly nav: ProjectNavigationService,
    private readonly store: SignalStore
  ) {
    title.setTitle('Project', false);
  }

  navigate(route: string[]) {
    this.nav.toProjectPage(...route);
  }
}
