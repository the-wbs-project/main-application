import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { faArrowUpFromBracket, faX } from '@fortawesome/pro-solid-svg-icons';
import { gearIcon } from '@progress/kendo-svg-icons';
import { SignalStore, TitleService } from '@wbs/core/services';
import { NavigationComponent } from '@wbs/main/components/navigation.component';
import { PageHeaderComponent } from '@wbs/main/components/page-header';
import { FindByIdPipe } from '@wbs/main/pipes/find-by-id.pipe';
import { NavigationMenuService } from '@wbs/main/services';
import { ProjectTitleComponent } from '../../components/project-title.component';
import { ApprovalBadgeComponent } from './components/approval-badge.component';
import { ProjectActionButtonComponent } from './components/project-action-button/project-action-button.component';
import { ProjectApprovalWindowComponent } from './components/project-approval-window/project-approval-window.component';
import { ProjectChecklistModalComponent } from './components/project-checklist-modal/project-checklist-modal.component';
import { PROJECT_NAVIGATION } from './models';
import { ProjectNavigationService } from './services';
import { ProjectApprovalState, ProjectState } from './states';

@Component({
  standalone: true,
  templateUrl: './project-view-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApprovalBadgeComponent,
    FindByIdPipe,
    NavigationComponent,
    PageHeaderComponent,
    ProjectActionButtonComponent,
    ProjectApprovalWindowComponent,
    ProjectChecklistModalComponent,
    ProjectTitleComponent,
    RouterModule,
  ],
})
export class ProjectViewLayoutComponent {
  private readonly navService = inject(NavigationMenuService);
  private readonly projectNavService = inject(ProjectNavigationService);
  private readonly store = inject(SignalStore);

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
  readonly links = computed(() =>
    this.navService.processLinks(PROJECT_NAVIGATION, this.claims())
  );

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

  constructor(title: TitleService) {
    title.setTitle('Project', false);
  }

  navigate(route: string[]) {
    this.projectNavService.toProjectPage(...route);
  }
}
