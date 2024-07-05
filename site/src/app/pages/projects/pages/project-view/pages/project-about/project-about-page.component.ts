import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
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
import { ChangeProjectBasics } from '../../actions';
import { ApprovalBadgeComponent } from '../../components/approval-badge.component';
import { ProjectChecklistComponent } from '../../components/project-checklist';
import {
  ProjectApprovalState,
  ProjectChecklistState,
  ProjectState,
  TasksState,
} from '../../states';
import { ProjectApprovalCardComponent } from './components/project-approval-card';
import { ProjectStatusCardComponent } from './components/project-status-card';

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
    ProjectStatusCardComponent,
    ResizedCssDirective,
    RoleListPipe,
    SafeHtmlPipe,
    TranslateModule,
  ],
  providers: [AiPromptService],
})
export class ProjectAboutComponent {
  private readonly prompt = inject(AiPromptService);
  private readonly store = inject(SignalStore);

  readonly askAi = model(false);
  readonly descriptionEditMode = model(false);
  readonly descriptionSave = new SaveService();
  readonly descriptionAiStartingDialog = computed(() =>
    this.prompt.projectDescription(this.project(), this.tasks())
  );
  readonly claims = this.store.select(ProjectState.claims);
  readonly project = this.store.select(ProjectState.current);
  readonly approvalEnabled = this.store.select(ProjectApprovalState.enabled);
  readonly tasks = this.store.select(TasksState.phases);
  readonly taskCount = this.store.select(TasksState.taskCount);
  readonly users = this.store.select(ProjectState.users);
  readonly checklist = this.store.select(ProjectChecklistState.results);
  readonly approvalStats = this.store.select(ProjectApprovalState.stats);
  readonly approvals = this.store.select(ProjectApprovalState.list);
  readonly canEdit = computed(
    () =>
      this.project()?.status === PROJECT_STATI.PLANNING &&
      Utils.contains(this.claims(), PROJECT_CLAIMS.UPDATE)
  );

  descriptionChange(description: string): void {
    const project = this.project()!;

    this.descriptionSave
      .call(
        this.store
          .dispatch(
            new ChangeProjectBasics(
              project.title,
              description,
              project.category
            )
          )
          .pipe(tap(() => this.descriptionEditMode.set(false)))
      )
      .subscribe();
  }

  aiChangeSaved(description: string): void {
    this.askAi.set(false);
    this.descriptionEditMode.set(false);
    this.descriptionChange(description);
  }
}
