import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DescriptionAiDialogComponent } from '@wbs/components/description-ai-dialog';
import { DescriptionCardComponent } from '@wbs/components/description-card';
import { DisciplineCardComponent } from '@wbs/components/discipline-card';
import { ResizedCssDirective } from '@wbs/core/directives/resize-css.directive';
import {
  AiPromptService,
  CategoryService,
  SaveService,
  SignalStore,
} from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { CheckPipe } from '@wbs/pipes/check.pipe';
import { EditedDateTextPipe } from '@wbs/pipes/edited-date-text.pipe';
import { FindByIdPipe } from '@wbs/pipes/find-by-id.pipe';
import { RoleListPipe } from '@wbs/pipes/role-list.pipe';
import { SafeHtmlPipe } from '@wbs/pipes/safe-html.pipe';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ApprovalBadgeComponent } from '../../components/approval-badge.component';
import { ProjectApprovalCardComponent } from './components/project-approval-card';
import { ProjectChecklistComponent } from '../../components/project-checklist';
import { ProjectDetailsCardComponent } from './components/project-details-card';
import { ProjectStatusCardComponent } from './components/project-status-card';
import { ProjectService, ProjectTaskService } from '../../services';
import { ProjectApprovalState, ProjectChecklistState } from '../../states';
import { ProjectStore } from '../../stores';
import { ProjectResourceCardComponent } from './components/resource-card';
import { ProjectContributorCardComponent } from './components/contributor-card';

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
    ProjectContributorCardComponent,
    ProjectDetailsCardComponent,
    ProjectResourceCardComponent,
    ProjectStatusCardComponent,
    ResizedCssDirective,
    RoleListPipe,
    SafeHtmlPipe,
    TranslateModule,
  ],
  providers: [AiPromptService],
})
export class ProjectAboutComponent {
  private readonly category = inject(CategoryService);
  private readonly projectService = inject(ProjectService);
  private readonly taskService = inject(ProjectTaskService);
  private readonly prompt = inject(AiPromptService);
  private readonly store = inject(SignalStore);
  //
  //  Public Services
  //
  readonly projectStore = inject(ProjectStore);
  readonly disciplineSave = new SaveService();
  readonly descriptionSave = new SaveService();
  //
  //  Public Models & Siganls
  //
  readonly askAi = model(false);
  readonly descriptionEditMode = model(false);
  readonly approvalEnabled = this.store.select(ProjectApprovalState.enabled);
  readonly checklist = this.store.select(ProjectChecklistState.results);
  readonly approvalStats = this.store.select(ProjectApprovalState.stats);
  readonly approvals = this.store.select(ProjectApprovalState.list);
  //
  //  Computed
  //
  readonly descriptionAiStartingDialog = computed(() =>
    this.prompt.projectDescription(
      this.projectStore.project(),
      this.projectStore.viewModels()
    )
  );
  readonly taskCount = computed(
    () => this.projectStore.viewModels()?.length ?? 0
  );
  readonly disciplines = computed(() =>
    this.category.buildViewModels(this.projectStore.project()?.disciplines)
  );
  readonly editDisciplines = computed(() =>
    this.category.buildDisciplines(this.projectStore.project()?.disciplines)
  );

  descriptionChange(description: string): void {
    this.projectService
      .changeProjectDescription(description)
      .pipe(tap(() => this.descriptionEditMode.set(false)))
      .subscribe();
  }

  saveDisciplines(disciplines: CategorySelection[]): void {
    const project = this.projectStore.project()!;
    const disciplinesResults = this.category.extract(
      disciplines,
      project.disciplines ?? []
    );

    this.disciplineSave
      .call(this.projectService.changeProjectDisciplines(disciplinesResults))
      .pipe(
        switchMap(() =>
          disciplinesResults.removedIds.length === 0
            ? of('')
            : this.taskService.removeDisciplinesFromTasks(
                disciplinesResults.removedIds
              )
        )
      )
      .subscribe();
  }

  aiChangeSaved(description: string): void {
    this.askAi.set(false);
    this.descriptionEditMode.set(false);
    this.descriptionChange(description);
  }
}
