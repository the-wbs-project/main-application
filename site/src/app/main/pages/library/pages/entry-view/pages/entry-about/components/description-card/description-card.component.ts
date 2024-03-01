import { NgClass, UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  TemplateRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faComment,
  faFloppyDisk,
  faPencil,
  faXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { EditorModule } from '@progress/kendo-angular-editor';
import { LibraryEntry, LibraryEntryVersion } from '@wbs/core/models';
import { AlertComponent } from '@wbs/main/components/alert.component';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';
import { DescriptionAiDialogComponent } from '../description-ai-dialog';

@Component({
  standalone: true,
  selector: 'wbs-description-card',
  templateUrl: './description-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    DescriptionAiDialogComponent,
    DialogModule,
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
  readonly faComment = faComment;
  readonly entry = input.required<LibraryEntry>();
  readonly version = input.required<LibraryEntryVersion>();
  readonly editMode = signal<boolean>(false);
  readonly askAi = model<boolean>(false);

  editDescription = '';

  edit(): void {
    this.editDescription = this.version()!.description ?? '';
    this.editMode.set(true);
  }

  save(description: string): void {
    this.descriptionChange.emit(description);
    this.editMode.set(false);
    this.askAi.set(false);
  }

  cancel(): void {
    this.editDescription = '';
    this.editMode.set(false);
  }
}
