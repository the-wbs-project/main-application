import { NgClass, UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
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
import { EditorModule } from '@progress/kendo-angular-editor';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';

@Component({
  standalone: true,
  selector: 'wbs-description-card',
  templateUrl: './description-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EditorModule,
    FontAwesomeModule,
    FormsModule,
    NgClass,
    SafeHtmlPipe,
    TranslateModule,
    UpperCasePipe,
  ],
})
export class DescriptionCardComponent {
  @Output() readonly descriptionChange = new EventEmitter<string>();

  readonly faPencil = faPencil;
  readonly faFloppyDisk = faFloppyDisk;
  readonly faXmark = faXmark;
  readonly description = input.required<string>();
  readonly editMode = signal<boolean>(false);

  editDescription = '';

  edit(): void {
    this.editDescription = this.description();
    this.editMode.set(true);
  }

  save(): void {
    this.descriptionChange.emit(this.editDescription);
    this.editMode.set(false);
  }

  cancel(): void {
    this.editDescription = '';
    this.editMode.set(false);
  }
}
