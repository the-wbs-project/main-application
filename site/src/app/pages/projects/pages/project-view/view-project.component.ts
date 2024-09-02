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
import { FadingMessageComponent } from '@wbs/components/_utils/fading-message.component';
import { SaveState } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { FindByIdPipe } from '@wbs/pipes/find-by-id.pipe';
import { ProjectCategoryIconPipe } from '@wbs/pipes/project-category-icon.pipe';
import { ProjectCategoryLabelPipe } from '@wbs/pipes/project-category-label.pipe';
import { ActionButtonComponent } from '@wbs/components/action-button';
import { ProjectChecklistModalComponent } from './components/project-checklist-modal/project-checklist-modal.component';
import { ProjectActionButtonService } from './services';
import { ProjectStore } from './stores';

@Component({
  standalone: true,
  templateUrl: './view-project.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ActionButtonComponent,
    FadingMessageComponent,
    FindByIdPipe,
    ProjectCategoryIconPipe,
    ProjectCategoryLabelPipe,
    ProjectChecklistModalComponent,
    RouterModule,
  ],
})
export class ProjectViewComponent {
  private readonly store = inject(SignalStore);

  readonly checkIcon = faCheck;
  readonly projectStore = inject(ProjectStore);
  readonly menuService = inject(ProjectActionButtonService);

  readonly userId = input.required<string>();
  readonly projectUrl = input.required<string[]>();

  /*readonly approvalEnabled = this.store.select(ProjectApprovalState.enabled);
  readonly approval = this.store.select(ProjectApprovalState.current);
  readonly approvals = this.store.select(ProjectApprovalState.list);
  readonly approvalView = this.store.select(ProjectApprovalState.view);
  readonly showApproval = computed(
    () => this.approvalView() === 'project' && this.approval() != undefined
  );
  readonly approvalHasChildren = this.store.select(
    ProjectApprovalState.hasChildren
  );
  readonly chat = this.store.select(ProjectApprovalState.messages);*/

  readonly titleSaveState = signal<SaveState>('ready');
  readonly menu = computed(() =>
    this.menuService.buildMenu(this.projectStore.project())
  );

  navigate(route: string[]): void {
    //this.store.dispatch(new Navigate([...this.projectUrl(), ...route]));
  }
}
