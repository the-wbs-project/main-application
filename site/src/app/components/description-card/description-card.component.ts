import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheck,
  faFloppyDisk,
  faPencil,
  faXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { ProjectApproval, SaveState } from '@wbs/core/models';
import { AiButtonComponent } from '@wbs/components/_utils/ai-button.component';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { ApprovalBadgeComponent } from '@wbs/components/_utils/approval-badge.component';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { SafeHtmlPipe } from '@wbs/pipes/safe-html.pipe';
import { EditorComponent } from '../_utils/editor.component';

@Component({
  standalone: true,
  selector: 'wbs-description-card',
  templateUrl: './description-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card dashboard-card full-item' },
  imports: [
    AiButtonComponent,
    AlertComponent,
    ApprovalBadgeComponent,
    ButtonModule,
    EditorComponent,
    FontAwesomeModule,
    FormsModule,
    SafeHtmlPipe,
    SaveButtonComponent,
    SaveMessageComponent,
    TranslateModule,
  ],
})
export class DescriptionCardComponent {
  readonly descriptionChange = output<string>();

  readonly checkIcon = faCheck;
  readonly faPencil = faPencil;
  readonly faFloppyDisk = faFloppyDisk;
  readonly faXmark = faXmark;
  readonly askAi = model.required<boolean>();
  readonly editMode = model.required<boolean>();
  readonly canEdit = input.required<boolean>();
  readonly description = input.required<string>();
  readonly saveState = input.required<SaveState>();
  readonly noDescriptionLabel = input.required<string>();
  readonly approval = input<ProjectApproval | undefined>(undefined);

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
