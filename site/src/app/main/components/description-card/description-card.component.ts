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
import { EditorModule } from '@progress/kendo-angular-editor';
import { ProjectApproval, SaveState } from '@wbs/core/models';
import { SaveMessageComponent } from '@wbs/dummy_components/save-message.component';
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';
import { AiButtonComponent } from '../ai-button.component';
import { AlertComponent } from '../../../dummy_components/alert.component';
import { ApprovalBadgeComponent } from '../approval-badge.component';
import { SaveButtonComponent } from '../save-button.component';

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
    EditorModule,
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
