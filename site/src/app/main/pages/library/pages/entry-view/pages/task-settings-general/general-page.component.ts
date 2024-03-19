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
import { SignalStore } from '@wbs/core/services';
import { AlertComponent } from '@wbs/main/components/alert.component';
import { EntryState, EntryTaskService } from '../../services';

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
    TextBoxModule,
    TranslateModule,
  ],
})
export class GeneralComponent {
  private readonly store = inject(SignalStore);
  private readonly service = inject(EntryTaskService);
  readonly state = inject(EntryState);

  readonly taskId = input.required<string>();

  readonly faRobot = faRobot;
  readonly faFloppyDisk = faFloppyDisk;
  readonly askAi = signal(true);
  readonly showSaved = signal(false);
  readonly task = this.state.getTask(this.taskId);
  readonly canSave = computed(() => {
    const task = this.task();

    if ((task?.title ?? '').length === 0) return false;

    return true;
  });
  readonly showDescriptionAlert = computed(
    () => (this.task()?.description ?? '').length === 0
  );

  save(): void {
    const task = this.task()!;
    this.service
      .generalSaveAsync(task.id, task.title, task.description)
      .subscribe(() => this.showSaved.set(true));
  }

  aiChangeSaved(description: string): void {
    this.askAi.set(false);
    /*this.task.update((v) => {
      v!.description = description;

      return v;
    });*/
  }
}
