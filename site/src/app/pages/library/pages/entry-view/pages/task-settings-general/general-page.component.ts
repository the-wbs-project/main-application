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
import { faFloppyDisk, faRobot } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { SaveMessageComponent } from '@wbs/components/save-message.component';
import { EntryTaskService, SaveService } from '@wbs/core/services';
import { AlertComponent } from '@wbs/main/components/alert.component';
import { EntryStore } from '@wbs/store';

@Component({
  standalone: true,
  templateUrl: './general-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    EditorModule,
    FontAwesomeModule,
    FormsModule,
    LabelModule,
    SaveMessageComponent,
    TextBoxModule,
    TranslateModule,
  ],
})
export class GeneralComponent {
  private readonly service = inject(EntryTaskService);
  readonly entryStore = inject(EntryStore);

  readonly taskId = input.required<string>();

  readonly faRobot = faRobot;
  readonly faFloppyDisk = faFloppyDisk;
  readonly askAi = signal(true);
  readonly task = this.entryStore.getTask(this.taskId);
  readonly canSave = computed(() => {
    const task = this.task();

    if ((task?.title ?? '').length === 0) return false;

    return true;
  });
  readonly showDescriptionAlert = computed(
    () => (this.task()?.description ?? '').length === 0
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
    /*this.task.update((v) => {
      v!.description = description;

      return v;
    });*/
  }
}
