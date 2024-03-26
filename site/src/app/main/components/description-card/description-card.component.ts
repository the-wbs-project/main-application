import { NgClass } from '@angular/common';
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
  faCheck,
  faComment,
  faFloppyDisk,
  faPencil,
  faXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { EditorModule } from '@progress/kendo-angular-editor';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { AlertComponent } from '../alert.component';
import { FadingMessageComponent } from '../fading-message.component';
import { SaveButtonComponent } from '../save-button.component';

@Component({
  standalone: true,
  selector: 'wbs-description-card',
  templateUrl: './description-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card dashboard-card full-item' },
  imports: [
    AlertComponent,
    EditorModule,
    FadingMessageComponent,
    FontAwesomeModule,
    FormsModule,
    NgClass,
    SafeHtmlPipe,
    SaveButtonComponent,
    TranslateModule,
  ],
})
export class DescriptionCardComponent {
  readonly descriptionChange = output<string>();

  readonly checkIcon = faCheck;
  readonly faPencil = faPencil;
  readonly faFloppyDisk = faFloppyDisk;
  readonly faXmark = faXmark;
  readonly faComment = faComment;
  readonly description = input.required<string>();
  readonly noDescriptionLabel = input.required<string>();
  readonly askAi = model.required<boolean>();
  readonly editMode = model.required<boolean>();
  readonly saveState = input<'ready' | 'saving' | 'saved'>('ready');

  editDescription = '';

  edit(): void {
    this.editDescription = this.description() ?? '';
    this.editMode.set(true);
  }

  save(description: string): void {
    this.descriptionChange.emit(description);
    this.askAi.set(false);
  }

  cancel(): void {
    this.editDescription = '';
    this.editMode.set(false);
  }
}
