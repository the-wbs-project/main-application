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
import { PROJECT_CLAIMS } from '@wbs/core/models';
import { CategoryLabelPipe } from '@wbs/main/pipes/category-label.pipe';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { DisciplineIconPipe } from '@wbs/main/pipes/discipline-icon.pipe';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';
import { PermissionsState } from '@wbs/main/states';
import { ProjectStatisticComponent } from '../../components/project-statistic.component';
import { TasksState } from '../../states';

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
  readonly canEditClaim = PROJECT_CLAIMS.TASKS.UPDATE;
  readonly current = toSignal(this.store.select(TasksState.current));
  readonly claims = toSignal(this.store.select(PermissionsState.claims));

  constructor(private readonly store: Store) {}
}
