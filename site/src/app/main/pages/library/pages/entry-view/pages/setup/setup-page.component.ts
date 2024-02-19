import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ListItem } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { EntryService } from '../../services';
import { EntryViewState } from '../../states';
import { WbsNodeView } from '@wbs/core/view-models';
import { PhaseSetupComponent } from './components/phase-setup';
import { TaskSetupComponent } from './components/task-setup';

@Component({
  standalone: true,
  templateUrl: './setup-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FontAwesomeModule,
    PhaseSetupComponent,
    TaskSetupComponent,
    TranslateModule,
  ],
})
export class SetupPageComponent {
  private readonly store = inject(SignalStore);
  private readonly entryService = inject(EntryService);

  private readonly entry = this.store.select(EntryViewState.entry);
  private readonly tasks = this.store.select(EntryViewState.tasks);

  readonly claims = input.required<string[]>();
  readonly phases = input.required<ListItem[]>();

  readonly version = this.store.select(EntryViewState.version);
  readonly isLoading = computed(
    () =>
      this.entry() === undefined ||
      this.version() === undefined ||
      this.tasks() === undefined
  );
  readonly isSetup = computed(() => this.tasks()!.length > 0);
  readonly type = computed(() => this.entry()!.type);

  readonly faSpinner = faSpinner;

  selectedTask?: WbsNodeView;

  setupPhaseEntry(title: string): void {
    this.entryService.setupPhaseTaskAsync(title).subscribe();
  }

  setupTaskEntry(title: string): void {
    this.entryService.setupTaskAsync(title).subscribe();
  }
}
