import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TextBoxModule } from '@progress/kendo-angular-inputs';

@Component({
  standalone: true,
  selector: 'wbs-task-title',
  templateUrl: './task-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    FormsModule,
    TextBoxModule,
    TranslateModule,
  ],
})
export class TaskTitle2Component {
  readonly faPencil = faPencil;
  readonly faTrash = faTrash;
  readonly showRemove = input(false);
  readonly level = input.required<string>();
  readonly title = model.required<string>();
  readonly canEdit = input.required<boolean>();
  readonly edit = output<void>();
  readonly remove = output<void>();
}
