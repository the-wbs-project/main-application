import { NgClass, UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  TemplateRef,
  inject,
  input,
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { EditorModule } from '@progress/kendo-angular-editor';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';
import { DescriptionAiDialogComponent } from '../description-ai-dialog';
import { AiModel, LibraryEntry, LibraryEntryVersion } from '@wbs/core/models';

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

  private modalService = inject(NgbModal);
  readonly faPencil = faPencil;
  readonly faFloppyDisk = faFloppyDisk;
  readonly faXmark = faXmark;
  readonly faComment = faComment;
  readonly entry = input.required<LibraryEntry>();
  readonly version = input.required<LibraryEntryVersion>();
  readonly editMode = signal<boolean>(false);

  editDescription = '';

  edit(): void {
    this.editDescription = this.version()!.description ?? '';
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

  open() {
    const modalRef = this.modalService.open(DescriptionAiDialogComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
      fullscreen: 'sm',
    });

    modalRef.componentInstance.setup(this.entry(), this.version());

    modalRef.result.then((value) => {
      this.descriptionChange.emit(value);
      this.editMode.set(false);
    });
  }
}
