import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  faTriangleExclamation,
  faTools,
} from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { TasksState } from '../../states';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CategoryLabelPipe } from '@wbs/main/pipes/category-label.pipe';
import { DisciplineIconPipe } from '@wbs/main/pipes/discipline-icon.pipe';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';

@Component({
  standalone: true,
  selector: 'wbs-task-about',
  templateUrl: './task-about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CategoryLabelPipe, CommonModule, DateTextPipe, DisciplineIconPipe, FontAwesomeModule, RouterModule, SafeHtmlPipe, TranslateModule]
})
export class TaskAboutComponent {
  readonly faTools = faTools;
  readonly faTriangleExclamation = faTriangleExclamation;
  readonly current = toSignal(this.store.select(TasksState.current));

  constructor(private readonly store: Store) {}
}
