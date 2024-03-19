import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
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
import { AlertComponent } from '@wbs/main/components/alert.component';
import { DisciplineListComponent } from '@wbs/main/components/discipline-list.component';
import { SavingAlertComponent } from '@wbs/main/components/saving-alert.component';
import { ResizedCssDirective } from '@wbs/main/directives/resize-css.directive';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { delay, tap } from 'rxjs/operators';
import { EntryState, EntryTaskService } from '../../services';
import { DescriptionCardComponent } from './components/description-card';
import { DetailsCardComponent } from './components/details-card';

@Component({
  standalone: true,
  templateUrl: './task-about-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    CheckPipe,
    DateTextPipe,
    DescriptionCardComponent,
    DetailsCardComponent,
    DisciplineListComponent,
    FontAwesomeModule,
    NgClass,
    ResizedCssDirective,
    RouterModule,
    SavingAlertComponent,
    TranslateModule,
  ],
})
export class TaskAboutPageComponent {
  private readonly taskService = inject(EntryTaskService);
  readonly state = inject(EntryState);

  readonly faTools = faTools;
  readonly faTriangleExclamation = faTriangleExclamation;
  readonly canEditClaim = LIBRARY_CLAIMS.TASKS.UPDATE;
  readonly saveState = signal<'saving' | 'saved' | undefined>(undefined);
  //
  //  Inputs
  //
  readonly claims = input.required<string[]>();
  readonly taskId = input.required<string>();
  //
  //  State Items
  //
  readonly task = this.state.getTask(this.taskId);

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
