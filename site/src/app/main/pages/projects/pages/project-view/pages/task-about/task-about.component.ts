import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTriangleExclamation,
  faTools,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { CategoryLabelPipe } from '@wbs/main/pipes/category-label.pipe';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { DisciplineIconPipe } from '@wbs/main/pipes/discipline-icon.pipe';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';
import { ProjectStatisticComponent } from '../../components/project-statistic.component';
import { ProjectState, TasksState } from '../../states';
import { PROJECT_PERMISSION_KEYS } from '@wbs/core/models';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';

@Component({
  standalone: true,
  selector: 'wbs-task-about',
  templateUrl: './task-about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CategoryLabelPipe,
    CheckPipe,
    CommonModule,
    DateTextPipe,
    DisciplineIconPipe,
    FontAwesomeModule,
    ProjectStatisticComponent,
    RouterModule,
    SafeHtmlPipe,
    TranslateModule,
  ],
})
export class TaskAboutComponent {
  readonly faTools = faTools;
  readonly faTriangleExclamation = faTriangleExclamation;
  readonly canEditKey = PROJECT_PERMISSION_KEYS.CAN_EDIT_TASKS;
  readonly current = toSignal(this.store.select(TasksState.current));
  readonly permissions = toSignal(this.store.select(ProjectState.permissions));

  constructor(private readonly store: Store) {}
}
