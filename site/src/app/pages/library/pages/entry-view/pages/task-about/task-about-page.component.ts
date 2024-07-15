import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTools,
  faTriangleExclamation,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { DescriptionCardComponent } from '@wbs/components/description-card';
import { DisciplineCardComponent } from '@wbs/components/discipline-card';
import { DescriptionAiDialogComponent } from '@wbs/components/description-ai-dialog';
import { SavingAlertComponent } from '@wbs/components/_utils/saving-alert.component';
import { ResizedCssDirective } from '@wbs/core/directives/resize-css.directive';
import {
  AiPromptService,
  SaveService,
  TaskModalService,
} from '@wbs/core/services';
import { EntryTaskService } from '@wbs/core/services/library';
import { EntryStore } from '@wbs/core/store';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { delay, tap } from 'rxjs/operators';
import { DetailsCardComponent } from './components/details-card';

@Component({
  standalone: true,
  templateUrl: './task-about-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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

  readonly faTools = faTools;
  readonly faTriangleExclamation = faTriangleExclamation;
  //
  //  Inputs & Models
  //
  readonly taskId = input.required<string>();
  readonly askAi = model(false);
  readonly descriptionEditMode = model(false);
  readonly descriptionSave = new SaveService();
  readonly disciplines = computed(() => this.entryStore.version()?.disciplines);
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
  readonly parent = computed(() =>
    this.entryStore.viewModels()?.find((t) => t.id === this.task()?.parentId)
  );

  descriptionChange(description: string): void {
    this.descriptionSave
      .call(
        this.taskService
          .descriptionChangedAsync(this.task()!.id, description)
          .pipe(
            delay(1000),
            tap(() => this.descriptionEditMode.set(false))
          )
      )
      .subscribe();
  }

  aiChangeSaved(description: string): void {
    this.askAi.set(false);
    this.descriptionEditMode.set(false);
    this.descriptionChange(description);
  }
}
