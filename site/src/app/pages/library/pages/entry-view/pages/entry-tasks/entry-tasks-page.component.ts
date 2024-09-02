import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { HeightDirective } from '@wbs/core/directives/height.directive';
import { LibraryTreeComponent } from './components';

@Component({
  standalone: true,
  templateUrl: './entry-tasks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogModule,
    HeightDirective,
    LibraryTreeComponent,
    TranslateModule,
  ],
})
export class TasksPageComponent {
  readonly showDialog = signal(false);
  readonly containerHeight = signal(100);
  readonly dialogContainerHeight = signal(100);
  readonly entryUrl = input.required<string[]>();
}
