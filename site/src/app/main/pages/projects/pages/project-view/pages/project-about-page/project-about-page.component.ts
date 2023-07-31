import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { CategoryLabelPipe } from '@wbs/main/pipes/category-label.pipe';
import { DisciplineIconPipe } from '@wbs/main/pipes/discipline-icon.pipe';
import { EditedDateTextPipe } from '@wbs/main/pipes/edited-date-text.pipe';
import { ProjectStatusPipe } from '@wbs/main/pipes/project-status.pipe';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';
import { map } from 'rxjs/operators';
import { ProjectChecklistComponent } from '../../components/project-checklist/project-checklist.component';
import { RoleTitlePipe } from '../../pipes/role-title.pipe';
import { ProjectChecklistState, ProjectState, TasksState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './project-about-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CategoryLabelPipe,
    CommonModule,
    DisciplineIconPipe,
    EditedDateTextPipe,
    ProjectChecklistComponent,
    ProjectStatusPipe,
    RoleTitlePipe,
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
}
