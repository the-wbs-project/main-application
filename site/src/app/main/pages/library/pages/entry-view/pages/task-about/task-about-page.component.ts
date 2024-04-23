import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { ResizedCssDirective } from '@wbs/core/directives/resize-css.directive';
import { LIBRARY_CLAIMS, ListItem, SaveState } from '@wbs/core/models';
import { DescriptionCardComponent } from '@wbs/main/components/description-card';
import { DisciplineCardComponent } from '@wbs/main/components/discipline-card';
import { DescriptionAiDialogComponent } from '@wbs/main/components/entry-description-ai-dialog';
import { SavingAlertComponent } from '@wbs/main/components/saving-alert.component';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { TaskModalService } from '@wbs/main/services';
import { delay, tap } from 'rxjs/operators';
import { EntryState, EntryTaskService } from '../../services';
import { DetailsCardComponent } from './components/details-card';

@Component({
  standalone: true,
  templateUrl: './task-about-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckPipe,
    DateTextPipe,
    DescriptionAiDialogComponent,
    DescriptionCardComponent,
    DetailsCardComponent,
    DisciplineCardComponent,
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
  readonly modal = inject(TaskModalService);
  readonly state = inject(EntryState);

  readonly UPDATE_CLAIM = LIBRARY_CLAIMS.TASKS.UPDATE;
  readonly faTools = faTools;
  readonly faTriangleExclamation = faTriangleExclamation;
  readonly canEditClaim = LIBRARY_CLAIMS.TASKS.UPDATE;
  //
  //  Inputs & Models
  //
  readonly claims = input.required<string[]>();
  readonly taskId = input.required<string>();
  readonly disciplines = input.required<ListItem[]>();
  readonly askAi = model(false);
  readonly descriptionEditMode = model(false);
  readonly descriptionSaveState = signal<SaveState>('ready');
  readonly disciplineFullList = computed(() => {
    const disciplines = this.state.version()?.disciplines;

    if (disciplines && disciplines.length > 0) return disciplines;

    return this.disciplines().map((x) => x.id);
  });
  readonly descriptionAiStartingDialog = computed(() => {
    const versionTitle = this.state.version()?.title;
    const taskTitle = this.task()?.title;
    return `Can you provide me with a one paragraph description of a task titled '${taskTitle}' belonging to a work breakdown structure titled '${versionTitle}'?`;
  });
  //
  //  State Items
  //
  readonly task = this.state.getTask(this.taskId);

  descriptionChange(description: string): void {
    this.descriptionSaveState.set('saving');

    this.taskService
      .descriptionChangedAsync(this.task()!.id, description)
      .pipe(
        delay(1000),
        tap(() => {
          this.descriptionEditMode.set(false);
          this.descriptionSaveState.set('saved');
        }),
        delay(5000)
      )
      .subscribe(() => this.descriptionSaveState.set('ready'));
  }

  aiChangeSaved(description: string): void {
    this.askAi.set(false);
    this.descriptionEditMode.set(false);
    this.descriptionChange(description);
  }
}
