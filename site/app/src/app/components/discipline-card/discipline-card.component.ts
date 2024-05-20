import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faComment,
  faFloppyDisk,
  faPencil,
  faXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { DisciplineSplitListComponent } from '@wbs/components/_utils/discipline-split-list.component';
import { CategoryViewModel } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-discipline-card',
  templateUrl: './discipline-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card dashboard-card' },
  imports: [
    AlertComponent,
    DisciplineSplitListComponent,
    FontAwesomeModule,
    NgClass,
    RouterModule,
    TranslateModule,
  ],
})
export class DisciplineCardComponent {
  readonly faPencil = faPencil;
  readonly faFloppyDisk = faFloppyDisk;
  readonly faXmark = faXmark;
  readonly faComment = faComment;
  readonly items = model.required<CategoryViewModel[]>();
  readonly canEdit = input.required<boolean>();
  readonly editRoute = input.required<string[]>();
  readonly alertIfEmpty = input(false);
  readonly noDisciplinesLabel = input.required<string>();
  readonly splitLimit = input.required<number>();
}
