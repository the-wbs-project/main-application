import {
  LowerCasePipe,
  NgClass,
  NgFor,
  NgIf,
  PercentPipe,
} from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { CategoryLabelPipe } from '@wbs/main/pipes/category-label.pipe';
import { DisciplineIconPipe } from '@wbs/main/pipes/discipline-icon.pipe';
import { EditedDateTextPipe } from '@wbs/main/pipes/edited-date-text.pipe';
import { ProjectStatusPipe } from '@wbs/main/pipes/project-status.pipe';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';
import { map } from 'rxjs/operators';
import { ApprovalBadgeComponent } from '../../../components/approval-badge.component';
import { ProjectChecklistComponent } from '../../../components/project-checklist/project-checklist.component';
import { ProjectStatisticComponent } from '../../../components/project-statistic.component';
import {
  ProjectApprovalState,
  ProjectChecklistState,
  ProjectState,
  TasksState,
} from '../../../states';
@Component({
  standalone: true,
  templateUrl: './project-about-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApprovalBadgeComponent,
    CategoryLabelPipe,
    DisciplineIconPipe,
    EditedDateTextPipe,
    FormsModule,
    PercentPipe,
    LowerCasePipe,
    NgClass,
    NgFor,
    NgIf,
    ProjectChecklistComponent,
    ProjectStatisticComponent,
    ProjectStatusPipe,
    RoleListPipe,
    SafeHtmlPipe,
    TranslateModule,
  ],
})
export class ProjectAboutPageComponent {
  private readonly store = inject(Store);

  readonly project = toSignal(
    this.store.select(ProjectState.current).pipe(map((p) => p!))
  );
  readonly taskCount = toSignal(this.store.select(TasksState.taskCount));
  readonly users = toSignal(this.store.select(ProjectState.users));
  readonly checklist = toSignal(
    this.store.select(ProjectChecklistState.results)
  );
  readonly approvalStats = toSignal(
    this.store.select(ProjectApprovalState.stats)
  );
  readonly approvals = toSignal(this.store.select(ProjectApprovalState.list));
}
