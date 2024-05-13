import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheck,
  faFloppyDisk,
  faRobot,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { FadingMessageComponent } from '@wbs/components/_utils/fading-message.component';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';
import { DescriptionAiDialogComponent } from '@wbs/components/description-ai-dialog';
import { AiPromptService, SaveService } from '@wbs/core/services';
import { EntryTaskService } from '@wbs/core/services/library';
import { EntryStore } from '@wbs/core/store';

@Component({
  standalone: true,
  templateUrl: './general-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    EditorModule,
    DescriptionAiDialogComponent,
    FadingMessageComponent,
    FontAwesomeModule,
    FormsModule,
    SaveButtonComponent,
    TextBoxModule,
    TranslateModule,
  ],
  providers: [AiPromptService],
})
export class GeneralComponent {
  private readonly service = inject(EntryTaskService);
  private readonly prompt = inject(AiPromptService);
  readonly entryStore = inject(EntryStore);

  readonly taskId = input.required<string>();

  readonly checkIcon = faCheck;
  readonly faRobot = faRobot;
  readonly faFloppyDisk = faFloppyDisk;
  readonly askAi = signal(false);
  readonly task = this.entryStore.getTask(this.taskId);
  readonly canSave = computed(() => {
    const task = this.task();

    if ((task?.title ?? '').length === 0) return false;

    return true;
  });
  readonly showDescriptionAlert = computed(
    () => (this.task()?.description ?? '').length === 0
  );
  readonly descriptionAiStartingDialog = computed(() =>
    this.prompt.libraryEntryTaskDescription(
      this.entryStore.entry(),
      this.entryStore.version(),
      this.taskId(),
      this.entryStore.viewModels()
    )
  );
  readonly saved = new SaveService();

  save(): void {
    const task = this.task()!;
    const changes = this.service.verifyChanges(
      task.id,
      task.title,
      task.description
    );

    if (!changes) return;

    this.saved
      .call(
        this.service.generalSaveAsync(task.id, task.title, task.description)
      )
      .subscribe();
  }

  aiChangeSaved(description: string): void {
    this.askAi.set(false);

    this.saved
      .call(this.service.descriptionChangedAsync(this.task()!.id, description))
      .subscribe();
  }
}
