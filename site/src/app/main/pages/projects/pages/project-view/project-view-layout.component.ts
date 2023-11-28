import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { faArrowUpFromBracket, faX } from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { gearIcon } from '@progress/kendo-svg-icons';
import { TitleService } from '@wbs/core/services';
import { ActionIconListComponent } from '@wbs/main/components/action-icon-list.component';
import { PageHeaderComponent } from '@wbs/main/components/page-header/page-header.component';
import { FillElementDirective } from '@wbs/main/directives/fill-element.directive';
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
    FillElementDirective,
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
  @Input({ required: true }) claims!: string[];
  @Input({ required: true }) userId!: string;

  readonly approval = toSignal(this.store.select(ProjectApprovalState.current));
  readonly approvals = toSignal(this.store.select(ProjectApprovalState.list));
  readonly approvalView = toSignal(
    this.store.select(ProjectApprovalState.view)
  );
  readonly showApproval = computed(
    () => this.approvalView() === 'project' && this.approval() != undefined
  );
  readonly approvalHasChildren = toSignal(
    this.store.select(ProjectApprovalState.hasChildren)
  );
  readonly chat = toSignal(this.store.select(ProjectApprovalState.messages));
  readonly project = toSignal(this.store.select(ProjectState.current));
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
    private readonly store: Store
  ) {
    title.setTitle('Project', false);
  }

  navigate(route: string[]) {
    this.nav.toProjectPage(...route);
  }
}
