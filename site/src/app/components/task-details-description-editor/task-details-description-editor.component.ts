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
import { TextAreaModule } from '@progress/kendo-angular-inputs';
import { SaveState } from '@wbs/core/models';
import { SaveMessageComponent } from '../_utils/save-message.component';

@Component({
  standalone: true,
  selector: 'wbs-task-details-description-editor',
  templateUrl: './task-details-description-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    FormsModule,
    SaveMessageComponent,
    TextAreaModule,
    TranslateModule,
  ],
})
export class TaskDetailsDescriptionEditorComponent implements OnChanges {
  //
  //  Constants
  //
  readonly saveIcon = faSave;
  readonly savingIcon = faSpinner;
  readonly cancelIcon = faXmark;
  //
  //  Inputs & Signals
  //
  readonly editable = input.required<boolean>();
  readonly description = input.required<string>();
  readonly saveState = input.required<SaveState>();
  readonly editDescription = signal<string>('');
  readonly saving = computed(() => this.saveState() === 'saving');
  //
  //  Outputs
  //
  readonly save = output<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['description']) this.reset();
  }

  keydown({ key }: { key: string }): void {
    if (key === 'Enter') this.save.emit(this.editDescription());
    else if (key === 'Escape') this.reset();
  }

  reset(): void {
    this.editDescription.set(this.description());
  }
}
