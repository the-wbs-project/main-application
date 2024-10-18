import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faSave, faXmark } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { SaveState } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-editable-text',
  templateUrl: './editable-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'child-hoverer' },
  imports: [
    ButtonModule,
    FontAwesomeModule,
    FormsModule,
    SaveMessageComponent,
    TranslateModule,
    TextBoxModule,
  ],
})
export class EditableTextComponent {
  readonly editIcon = faPencil;
  readonly saveIcon = faSave;
  readonly cancelIcon = faXmark;
  readonly viewText = input.required<string>();
  readonly saveState = input.required<SaveState>();
  readonly editable = input<boolean>(true);
  readonly editText = model<string>();
  readonly editMode = signal(false);
  readonly saveText = output<string>();

  edit(): void {
    this.editMode.set(true);
  }

  keydown({ key }: { key: string }): void {
    if (key === 'Enter') this.save();
    else if (key === 'Escape') this.cancel();
  }

  save(): void {
    const text = this.editText();

    this.editMode.set(false);
    this.saveText.emit(text!);
  }

  cancel(): void {
    this.editMode.set(false);
  }
}
