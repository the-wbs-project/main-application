import { NgClass, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { ResizedCssDirective } from '@wbs/main/directives/resize-css.directive';
import { EditedDateTextPipe } from '@wbs/main/pipes/edited-date-text.pipe';
import { FindByIdPipe } from '@wbs/main/pipes/find-by-id.pipe';
import { ProjectStatusPipe } from '@wbs/main/pipes/project-status.pipe';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';
import { map } from 'rxjs/operators';
import { ApprovalBadgeComponent } from '../../../components/approval-badge.component';
import { DisciplineListComponent } from '../../../components/discipline-list.component';
import { ProjectChecklistComponent } from '../../../components/project-checklist/project-checklist.component';
import {
  ProjectApprovalState,
  ProjectChecklistState,
  ProjectState,
  TasksState,
} from '../../../states';
import { ProjectApprovalTileComponent } from './components/project-approval-tile/project-approval-tile.component';
import { ProjectStatusTileComponent } from './components/project-status-tile/project-status-tile.component';

@Component({
  standalone: true,
  templateUrl: './project-about-page.component.html',
  styleUrl: './project-about-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApprovalBadgeComponent,
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
  private readonly store = inject(Store);

  readonly project = toSignal(
    this.store.select(ProjectState.current).pipe(map((p) => p!))
  );
  readonly approvalEnabled = toSignal(
    this.store.select(ProjectApprovalState.enabled)
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

  test(): void {
    console.log('testing 1243');
  }
}
