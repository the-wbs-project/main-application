import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ResizedCssDirective } from '@wbs/core/directives/resize-css.directive';
import { PROJECT_CLAIMS, PROJECT_STATI } from '@wbs/core/models';
import {
  AiPromptService,
  SaveService,
  SignalStore,
  Utils,
} from '@wbs/core/services';
import { DescriptionAiDialogComponent } from '@wbs/components/description-ai-dialog';
import { DescriptionCardComponent } from '@wbs/components/description-card';
import { DisciplineCardComponent } from '@wbs/components/discipline-card';
import { CheckPipe } from '@wbs/pipes/check.pipe';
import { EditedDateTextPipe } from '@wbs/pipes/edited-date-text.pipe';
import { FindByIdPipe } from '@wbs/pipes/find-by-id.pipe';
import { RoleListPipe } from '@wbs/pipes/role-list.pipe';
import { SafeHtmlPipe } from '@wbs/pipes/safe-html.pipe';
import { tap } from 'rxjs/operators';
import { ApprovalBadgeComponent } from '../../components/approval-badge.component';
import { ProjectChecklistComponent } from '../../components/project-checklist';
import {
  ProjectApprovalState,
  ProjectChecklistState,
  TasksState,
} from '../../states';
import { ProjectApprovalCardComponent } from './components/project-approval-card';
import { ProjectStatusCardComponent } from './components/project-status-card';
import { ProjectDetailsCardComponent } from './components/project-details-card';
import { ProjectStore } from '../../stores';
import { ProjectService } from '../../services';

@Component({
  standalone: true,
  templateUrl: './project-about-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApprovalBadgeComponent,
    CheckPipe,
    DescriptionAiDialogComponent,
    DescriptionCardComponent,
    DisciplineCardComponent,
    EditedDateTextPipe,
    FindByIdPipe,
    NgClass,
    ProjectApprovalCardComponent,
    ProjectChecklistComponent,
    ProjectDetailsCardComponent,
    ProjectStatusCardComponent,
    ResizedCssDirective,
    RoleListPipe,
    SafeHtmlPipe,
    TranslateModule,
  ],
  providers: [AiPromptService],
})
export class ProjectAboutComponent {
  private readonly projectService = inject(ProjectService);
  private readonly prompt = inject(AiPromptService);
  private readonly store = inject(SignalStore);

  readonly projectStore = inject(ProjectStore);

  readonly askAi = model(false);
  readonly descriptionEditMode = model(false);
  readonly descriptionSave = new SaveService();
  readonly descriptionAiStartingDialog = computed(() =>
    this.prompt.projectDescription(this.projectStore.project(), this.tasks())
  );
  readonly approvalEnabled = this.store.select(ProjectApprovalState.enabled);
  readonly tasks = this.store.select(TasksState.phases);
  readonly taskCount = this.store.select(TasksState.taskCount);
  readonly checklist = this.store.select(ProjectChecklistState.results);
  readonly approvalStats = this.store.select(ProjectApprovalState.stats);
  readonly approvals = this.store.select(ProjectApprovalState.list);
  readonly canEdit = computed(
    () =>
      this.projectStore.project()?.status === PROJECT_STATI.PLANNING &&
      Utils.contains(this.projectStore.claims(), PROJECT_CLAIMS.UPDATE)
  );

  descriptionChange(description: string): void {
    this.projectService
      .changeProjectDescription(description)
      .pipe(tap(() => this.descriptionEditMode.set(false)))
      .subscribe();
  }

  aiChangeSaved(description: string): void {
    this.askAi.set(false);
    this.descriptionEditMode.set(false);
    this.descriptionChange(description);
  }
}
