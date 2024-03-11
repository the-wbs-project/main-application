import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTriangleExclamation,
  faTools,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { PROJECT_CLAIMS, PROJECT_STATI } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { DisciplineListComponent } from '@wbs/main/components/discipline-list.component';
import { ResizedCssDirective } from '@wbs/main/directives/resize-css.directive';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';
import { ProjectState, TasksState } from '../../../states';

@Component({
  standalone: true,
  selector: 'wbs-task-about',
  templateUrl: './task-about.component.html',
  styleUrl: './task-about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckPipe,
    DateTextPipe,
    DisciplineListComponent,
    FontAwesomeModule,
    ResizedCssDirective,
    RouterModule,
    SafeHtmlPipe,
    TranslateModule,
  ],
})
export class TaskAboutComponent {
  readonly faTools = faTools;
  readonly faTriangleExclamation = faTriangleExclamation;
  readonly canEditClaim = PROJECT_CLAIMS.TASKS.UPDATE;
  readonly claims = input.required<string[]>();
  readonly project = this.store.select(ProjectState.current);
  readonly current = this.store.select(TasksState.current);
  readonly isPlanning = computed(
    () => this.project()?.status === PROJECT_STATI.PLANNING
  );

  constructor(private readonly store: SignalStore) {}
}
