import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LibraryVersionViewModel, TaskViewModel } from '@wbs/core/view-models';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';

@Component({
  standalone: true,
  selector: 'wbs-task-details-card',
  templateUrl: './details-card.component.html',
  host: { class: 'card dashboard-card' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DateTextPipe, RouterModule, TranslateModule],
})
export class DetailsCardComponent {
  readonly version = input.required<LibraryVersionViewModel>();
  readonly task = input.required<TaskViewModel>();
  readonly parent = input.required<TaskViewModel | undefined>();
}
