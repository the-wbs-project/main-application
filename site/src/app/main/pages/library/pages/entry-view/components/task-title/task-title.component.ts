import { NgClass, UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faFloppyDisk,
  faPencil,
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
    NgClass,
    TextBoxModule,
    TranslateModule,
    UpperCasePipe,
  ],
})
export class TaskTitleComponent {
  readonly titleChanged = output<string>();

  readonly faPencil = faPencil;
  readonly faFloppyDisk = faFloppyDisk;
  readonly faXmark = faXmark;
  readonly title = input.required<string>();
  readonly editMode = signal<boolean>(false);

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
    this.titleChanged.emit(this.editTitle);
    this.editMode.set(false);
    console.log('saved in component');
  }

  cancel(): void {
    this.editTitle = '';
    this.editMode.set(false);
  }
}
