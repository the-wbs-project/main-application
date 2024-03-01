import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  signal,
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
import { AlertComponent } from '@wbs/main/components/alert.component';
import { ResizedCssDirective } from '@wbs/main/directives/resize-css.directive';
import { DisciplineListComponent } from '@wbs/main/pages/projects/pages/project-view/components/discipline-list.component';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { PhaseLabelPipe } from '@wbs/main/pipes/phase-label.pipe';
import { EntryTaskService } from '../../services';
import { EntryViewState } from '../../states';
import { DescriptionCardComponent } from './components/description-card';
import { delay, tap } from 'rxjs';
import { SavingAlertComponent } from '@wbs/main/components/saving-alert.component';

@Component({
  standalone: true,
  templateUrl: './task-about-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    CheckPipe,
    DateTextPipe,
    DescriptionCardComponent,
    DisciplineListComponent,
    FontAwesomeModule,
    NgClass,
    PhaseLabelPipe,
    ResizedCssDirective,
    RouterModule,
    SavingAlertComponent,
    TranslateModule,
  ],
})
export class TaskAboutPageComponent {
  private readonly store = inject(SignalStore);
  private readonly taskService = inject(EntryTaskService);

  readonly faTools = faTools;
  readonly faTriangleExclamation = faTriangleExclamation;
  readonly canEditClaim = LIBRARY_CLAIMS.TASKS.UPDATE;
  readonly saveState = signal<'saving' | 'saved' | undefined>(undefined);
  //
  //  Inputs
  //
  readonly claims = input.required<string[]>();
  //
  //  State Items
  //
  readonly entry = this.store.select(EntryViewState.entry);
  readonly version = this.store.select(EntryViewState.version);
  readonly task = this.store.select(EntryViewState.taskVm);

  descriptionChange(description: string): void {
    this.saveState.set('saving');
    this.taskService
      .descriptionChangedAsync(this.task()!.id, description)
      .pipe(
        tap(() => this.saveState.set('saved')),
        delay(2000)
      )
      .subscribe(() => this.saveState.set(undefined));
  }
}
