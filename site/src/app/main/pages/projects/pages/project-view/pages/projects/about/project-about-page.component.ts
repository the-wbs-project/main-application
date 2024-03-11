import { NgClass, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SignalStore } from '@wbs/core/services';
import { DisciplineListComponent } from '@wbs/main/components/discipline-list.component';
import { ResizedCssDirective } from '@wbs/main/directives/resize-css.directive';
import { EditedDateTextPipe } from '@wbs/main/pipes/edited-date-text.pipe';
import { FindByIdPipe } from '@wbs/main/pipes/find-by-id.pipe';
import { ProjectStatusPipe } from '@wbs/main/pipes/project-status.pipe';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';
import { ApprovalBadgeComponent } from '../../../components/approval-badge.component';
import { ProjectChecklistComponent } from '../../../components/project-checklist';
import {
  ProjectApprovalState,
  ProjectChecklistState,
  ProjectState,
  TasksState,
} from '../../../states';
import { ProjectApprovalTileComponent } from './components/project-approval-tile/project-approval-tile.component';
import { ProjectStatusTileComponent } from './components/project-status-tile/project-status-tile.component';
import { DescriptionCardComponent } from './components/description-card';
import { ChangeProjectBasics } from '../../../actions';

@Component({
  standalone: true,
  templateUrl: './project-about-page.component.html',
  styleUrl: './project-about-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApprovalBadgeComponent,
    DescriptionCardComponent,
    DisciplineListComponent,
    EditedDateTextPipe,
    FindByIdPipe,
    NgClass,
    ProjectApprovalTileComponent,
    ProjectChecklistComponent,
    ProjectStatusPipe,
    ProjectStatusTileComponent,
    ResizedCssDirective,
    RoleListPipe,
    SafeHtmlPipe,
    TranslateModule,
    UpperCasePipe,
  ],
})
export class ProjectAboutPageComponent {
  private readonly store = inject(SignalStore);

  readonly project = this.store.select(ProjectState.current);
  readonly approvalEnabled = this.store.select(ProjectApprovalState.enabled);
  readonly taskCount = this.store.select(TasksState.taskCount);
  readonly users = this.store.select(ProjectState.users);
  readonly checklist = this.store.select(ProjectChecklistState.results);
  readonly approvalStats = this.store.select(ProjectApprovalState.stats);
  readonly approvals = this.store.select(ProjectApprovalState.list);

  test(): void {}

  descriptionChange(description: string): void {
    const project = this.project()!;

    this.store.dispatch(
      new ChangeProjectBasics(project.title, description, project.category)
    );
  }
}
