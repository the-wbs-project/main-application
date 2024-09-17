import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-task-title',
  templateUrl: './task-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, TranslateModule],
})
export class TaskTitleComponent {
  readonly faPencil = faPencil;
  readonly faTrash = faTrash;
  readonly showRemove = input(false);
  readonly level = input.required<string>();
  readonly title = model.required<string>();
  readonly canEdit = input.required<boolean>();
  readonly edit = output<void>();
  readonly remove = output<void>();
}
