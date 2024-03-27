import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { SignalStore } from '@wbs/core/services';
import { NavigationComponent } from '@wbs/main/components/navigation.component';
import { PageHeaderComponent } from '@wbs/main/components/page-header';
import { FindByIdPipe } from '@wbs/main/pipes/find-by-id.pipe';
import { NavigationMenuService } from '@wbs/main/services';
import { ApprovalBadgeComponent } from './components/approval-badge.component';
import { ProjectActionButtonComponent } from './components/project-action-button.component';
import { ProjectApprovalWindowComponent } from './components/project-approval-window/project-approval-window.component';
import { ProjectChecklistModalComponent } from './components/project-checklist-modal/project-checklist-modal.component';
import { ProjectTitleComponent } from './components/project-title';
import { ChangeProjectBasics } from './actions';
import { PROJECT_NAVIGATION } from './models';
import { ProjectApprovalState, ProjectState } from './states';

@Component({
  standalone: true,
  templateUrl: './view-project.component.html',
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
export class ProjectViewComponent {
  private readonly navService = inject(NavigationMenuService);
  private readonly store = inject(SignalStore);

  readonly claims = input.required<string[]>();
  readonly userId = input.required<string>();
  readonly projectUrl = input.required<string[]>();

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
  readonly navSection = this.store.select(ProjectState.navSection);
  readonly category = computed(() => this.project()?.category);
  readonly title = computed(() => this.project()?.title);
  readonly links = computed(() =>
    this.navService.processLinks(PROJECT_NAVIGATION, this.claims())
  );

  titleChanged(title: string): void {
    const project = this.project()!;

    this.store.dispatch(
      new ChangeProjectBasics(title, project.description, project.category)
    );
  }

  navigate(route: string[]): void {
    this.store.dispatch(new Navigate([...this.projectUrl(), ...route]));
  }
}
