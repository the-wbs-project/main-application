import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { Navigate } from '@ngxs/router-plugin';
import { FadingMessageComponent } from '@wbs/components/_utils/fading-message.component';
import { NavigationComponent } from '@wbs/components/_utils/navigation.component';
import { PageHeaderComponent } from '@wbs/components/page-header';
import { PROJECT_STATI, SaveState } from '@wbs/core/models';
import { NavigationMenuService, SignalStore } from '@wbs/core/services';
import { FindByIdPipe } from '@wbs/pipes/find-by-id.pipe';
import { ApprovalBadgeComponent } from './components/approval-badge.component';
import { ProjectActionButtonComponent } from './components/project-action-button.component';
import { ProjectApprovalWindowComponent } from './components/project-approval-window/project-approval-window.component';
import { ProjectChecklistModalComponent } from './components/project-checklist-modal/project-checklist-modal.component';
import { ProjectTitleComponent } from './components/project-title';
import { PROJECT_NAVIGATION } from './models';
import { ProjectApprovalState } from './states';
import { ProjectStore } from './stores';

@Component({
  standalone: true,
  templateUrl: './view-project.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApprovalBadgeComponent,
    FadingMessageComponent,
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

  readonly checkIcon = faCheck;
  readonly projectStore = inject(ProjectStore);

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
  readonly titleSaveState = signal<SaveState>('ready');
  readonly category = computed(() => this.projectStore.project()?.category);
  readonly title = computed(() => this.projectStore.project()?.title);
  readonly links = computed(() =>
    this.navService.processLinks(
      PROJECT_NAVIGATION,
      this.projectStore.project()?.status === PROJECT_STATI.PLANNING,
      this.projectStore.claims() ?? []
    )
  );

  titleChanged(title: string): void {}

  navigate(route: string[]): void {
    this.store.dispatch(new Navigate([...this.projectUrl(), ...route]));
  }
}
