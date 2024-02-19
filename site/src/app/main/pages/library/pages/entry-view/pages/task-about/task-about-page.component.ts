import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTools,
  faTriangleExclamation,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { LIBRARY_CLAIMS } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { ResizedCssDirective } from '@wbs/main/directives/resize-css.directive';
import { DisciplineListComponent } from '@wbs/main/pages/projects/pages/project-view/components/discipline-list.component';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { PhaseLabelPipe } from '@wbs/main/pipes/phase-label.pipe';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';
import { EntryViewState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './task-about-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckPipe,
    DateTextPipe,
    DisciplineListComponent,
    FontAwesomeModule,
    PhaseLabelPipe,
    ResizedCssDirective,
    RouterModule,
    SafeHtmlPipe,
    TranslateModule,
  ],
})
export class TaskAboutPageComponent {
  private readonly store = inject(SignalStore);

  readonly faTools = faTools;
  readonly faTriangleExclamation = faTriangleExclamation;
  readonly canEditClaim = LIBRARY_CLAIMS.TASKS.UPDATE;

  readonly claims = input.required<string[]>();
  readonly entry = this.store.select(EntryViewState.entry);
  readonly version = this.store.select(EntryViewState.version);
  readonly current = this.store.select(EntryViewState.taskVm);
}
