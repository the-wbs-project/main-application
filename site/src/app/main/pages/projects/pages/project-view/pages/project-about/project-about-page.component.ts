import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ResizedCssDirective } from '@wbs/core/directives/resize-css.directive';
import { PROJECT_CLAIMS, SaveState } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { DescriptionCardComponent } from '@wbs/main/components/description-card';
import { DisciplineCardComponent } from '@wbs/main/components/discipline-card';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { EditedDateTextPipe } from '@wbs/main/pipes/edited-date-text.pipe';
import { FindByIdPipe } from '@wbs/main/pipes/find-by-id.pipe';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';
import { delay, tap } from 'rxjs/operators';
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
})
export class ProjectAboutComponent {
  private readonly store = inject(SignalStore);

  readonly claims = input.required<string[]>();

  readonly askAi = model(false);
  readonly descriptionEditMode = model(false);
  readonly descriptionSaveState = signal<SaveState>('ready');

  readonly project = this.store.select(ProjectState.current);
  readonly approvalEnabled = this.store.select(ProjectApprovalState.enabled);
  readonly taskCount = this.store.select(TasksState.taskCount);
  readonly users = this.store.select(ProjectState.users);
  readonly checklist = this.store.select(ProjectChecklistState.results);
  readonly approvalStats = this.store.select(ProjectApprovalState.stats);
  readonly approvals = this.store.select(ProjectApprovalState.list);

  readonly UPDATE_CLAIM = PROJECT_CLAIMS.UPDATE;

  descriptionChange(description: string): void {
    this.descriptionSaveState.set('saving');

    const project = this.project()!;

    this.store
      .dispatch(
        new ChangeProjectBasics(project.title, description, project.category)
      )
      .pipe(
        delay(1000),
        tap(() => {
          this.descriptionEditMode.set(false);
          this.descriptionSaveState.set('saved');
        }),
        delay(5000)
      )
      .subscribe(() => this.descriptionSaveState.set('ready'));
  }

  aiChangeSaved(description: string): void {
    this.askAi.set(false);
    this.descriptionEditMode.set(false);
    this.descriptionChange(description);
  }
}
