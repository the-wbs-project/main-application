import { NgClass, UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTriangleExclamation,
  faTools,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { PROJECT_CLAIMS, PROJECT_STATI } from '@wbs/core/models';
import { ResizedCssDirective } from '@wbs/main/directives/resize-css.directive';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { ProjectCategoryLabelPipe } from '@wbs/main/pipes/project-category-label.pipe';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';
import { DisciplineListComponent } from '../../../components/discipline-list.component';
import { ProjectStatisticComponent } from '../../../components/project-statistic.component';
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
    NgClass,
    ProjectStatisticComponent,
    ProjectCategoryLabelPipe,
    ResizedCssDirective,
    RouterModule,
    SafeHtmlPipe,
    TranslateModule,
    UpperCasePipe,
  ],
})
export class TaskAboutComponent {
  @Input({ required: true }) claims!: string[];

  readonly faTools = faTools;
  readonly faTriangleExclamation = faTriangleExclamation;
  readonly canEditClaim = PROJECT_CLAIMS.TASKS.UPDATE;
  readonly project = toSignal(this.store.select(ProjectState.current));
  readonly current = toSignal(this.store.select(TasksState.current));
  readonly isPlanning = computed(
    () => this.project()?.status === PROJECT_STATI.PLANNING
  );

  constructor(private readonly store: Store) {}
}
