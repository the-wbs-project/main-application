import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk, faXmark } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TextBoxModule } from '@progress/kendo-angular-inputs';

@Component({
  standalone: true,
  selector: 'wbs-task-title-editor',
  templateUrl: './task-title-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    FormsModule,
    TextBoxModule,
    TranslateModule,
  ],
})
export class TaskTitleEditorComponent implements OnChanges {
  readonly faFloppyDisk = faFloppyDisk;
  readonly faXmark = faXmark;
  readonly title = input.required<string>();
  readonly save = output<string>();
  readonly cancel = output<void>();

  editTitle = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['title']) this.editTitle = this.title();
  }

  keydown({ key }: { key: string }): void {
    if (key === 'Enter') this.save.emit(this.editTitle);
    else if (key === 'Escape') this.cancel.emit();
  }
}
