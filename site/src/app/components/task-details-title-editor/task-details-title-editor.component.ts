import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faSpinner, faXmark } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { SaveState } from '@wbs/core/models';
import { SaveMessageComponent } from '../_utils/save-message.component';

@Component({
  standalone: true,
  selector: 'wbs-task-details-title-editor',
  templateUrl: './task-details-title-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    FormsModule,
    SaveMessageComponent,
    TextBoxModule,
    TranslateModule,
  ],
})
export class TaskDetailsTitleEditorComponent implements OnChanges {
  //
  //  Constants
  //
  readonly saveIcon = faSave;
  readonly savingIcon = faSpinner;
  readonly cancelIcon = faXmark;
  //
  //  Inputs & Signals
  //
  readonly title = input.required<string>();
  readonly editable = input.required<boolean>();
  readonly saveState = input.required<SaveState>();
  readonly editTitle = signal<string>('');
  readonly saving = computed(() => this.saveState() === 'saving');
  //
  //  Outputs
  //
  readonly save = output<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['title']) this.reset();
  }

  keydown({ key }: { key: string }): void {
    if (key === 'Enter') this.save.emit(this.editTitle());
    else if (key === 'Escape') this.reset();
  }

  reset(): void {
    this.editTitle.set(this.title());
  }
}
