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
import {
  faFloppyDisk,
  faPencil,
  faTrash,
  faXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TextBoxModule } from '@progress/kendo-angular-inputs';

@Component({
  standalone: true,
  selector: 'wbs-task-title',
  templateUrl: './task-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    FormsModule,
    TextBoxModule,
    TranslateModule,
  ],
})
export class TaskTitleComponent {
  readonly faPencil = faPencil;
  readonly faFloppyDisk = faFloppyDisk;
  readonly faXmark = faXmark;
  readonly faTrash = faTrash;
  readonly showRemove = input(false);
  readonly title = model.required<string>();
  readonly canEdit = input.required<boolean>();
  readonly editMode = signal<boolean>(false);
  readonly remove = output<void>();

  editTitle = '';

  keydown({ key }: { key: string }): void {
    if (key === 'Enter') this.save();
    else if (key === 'Escape') this.cancel();
  }

  edit(): void {
    this.editTitle = this.title();
    this.editMode.set(true);
  }

  save(): void {
    this.title.set(this.editTitle);
    this.editMode.set(false);
  }

  cancel(): void {
    this.editTitle = '';
    this.editMode.set(false);
  }
}
