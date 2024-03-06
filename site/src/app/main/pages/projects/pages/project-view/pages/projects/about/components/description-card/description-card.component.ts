import { UpperCasePipe } from '@angular/common';
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
import { Project, ProjectApproval } from '@wbs/core/models';
import { AlertComponent } from '@wbs/main/components/alert.component';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';
import { ApprovalBadgeComponent } from '../../../../../components/approval-badge.component';

@Component({
  standalone: true,
  selector: 'wbs-description-card',
  templateUrl: './description-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    ApprovalBadgeComponent,
    EditorModule,
    FontAwesomeModule,
    FormsModule,
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
  readonly approval = input.required<ProjectApproval | undefined>();
  readonly project = input.required<Project>();
  readonly editMode = signal<boolean>(false);

  editDescription = '';

  edit(): void {
    this.editDescription = this.project()!.description ?? '';
    this.editMode.set(true);
  }

  save(description: string): void {
    this.descriptionChange.emit(description);
    this.editMode.set(false);
  }

  cancel(): void {
    this.editDescription = '';
    this.editMode.set(false);
  }
}
