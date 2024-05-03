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
import { DescriptionAiDialogComponent } from '@wbs/components/description-ai-dialog';
import { SavingAlertComponent } from '@wbs/main/components/saving-alert.component';
import { CheckPipe } from '@wbs/pipes/check.pipe';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { TaskModalService } from '@wbs/main/services';
import { delay, tap } from 'rxjs/operators';
import { DetailsCardComponent } from './components/details-card';
import { AiPromptService, EntryTaskService } from '@wbs/core/services';
import { EntryStore } from '@wbs/store';

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
  providers: [AiPromptService],
})
export class TaskAboutPageComponent {
  private readonly prompt = inject(AiPromptService);
  private readonly taskService = inject(EntryTaskService);
  readonly modal = inject(TaskModalService);
  readonly entryStore = inject(EntryStore);

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
    const disciplines = this.entryStore.version()?.disciplines;

    if (disciplines && disciplines.length > 0) return disciplines;

    return this.disciplines().map((x) => x.id);
  });
  readonly descriptionAiStartingDialog = computed(() =>
    this.prompt.libraryEntryTaskDescription(
      this.entryStore.entry(),
      this.entryStore.version(),
      this.taskId(),
      this.entryStore.viewModels()
    )
  );
  //
  //  State Items
  //
  readonly task = this.entryStore.getTask(this.taskId);

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
