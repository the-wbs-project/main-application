import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { LibraryTreeComponent } from '../../components/library-tree';
import { EntryStore } from '@wbs/store';

@Component({
  standalone: true,
  templateUrl: './entry-tasks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FontAwesomeModule,
    LibraryTreeComponent,
    RouterModule,
    TranslateModule,
  ],
})
export class TasksPageComponent {
  readonly entryStore = inject(EntryStore);

  readonly faSpinner = faSpinner;

  readonly claims = input.required<string[]>();
  readonly entryUrl = input.required<string[]>();

  readonly isLoading = computed(
    () => !this.entryStore.entry() || !this.entryStore.version()
  );
}
