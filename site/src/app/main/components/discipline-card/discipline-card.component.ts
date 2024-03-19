import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
  model,
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
import { ProjectCategory } from '@wbs/core/models';
import { AlertComponent } from '../alert.component';
import { DisciplineEditorComponent } from '../discipline-editor';
import { DisciplineListComponent } from '../discipline-list.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'wbs-discipline-card',
  templateUrl: './discipline-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card border' },
  imports: [
    AlertComponent,
    DisciplineEditorComponent,
    DisciplineListComponent,
    FontAwesomeModule,
    FormsModule,
    NgClass,
    RouterModule,
    TranslateModule,
  ],
})
export class DisciplineCardComponent {
  @Output() readonly descriptionChange = new EventEmitter<string>();

  readonly faPencil = faPencil;
  readonly faFloppyDisk = faFloppyDisk;
  readonly faXmark = faXmark;
  readonly faComment = faComment;
  readonly selectedList = model.required<ProjectCategory[]>();
  readonly fullList = model.required<ProjectCategory[]>();
  readonly canEdit = input.required<boolean>();
  readonly editRoute = input.required<string[]>();
  readonly alertIfEmpty = input(false);
  readonly noDisciplinesLabel = input.required<string>();
}
