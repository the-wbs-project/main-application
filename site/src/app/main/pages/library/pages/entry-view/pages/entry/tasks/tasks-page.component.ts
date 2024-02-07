import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ListItem } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { EntryService } from '../../../services';
import { EntryViewState } from '../../../states';
import { LibraryTreeComponent } from './components/library-tree';
import { PhaseSetupComponent } from './components/phase-setup';

@Component({
  standalone: true,
  templateUrl: './tasks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FontAwesomeModule,
    LibraryTreeComponent,
    PhaseSetupComponent,
    TranslateModule,
  ],
})
export class TasksPageComponent {
  private readonly store = inject(SignalStore);
  private readonly entryService = inject(EntryService);

  readonly claims = input.required<string[]>();
  readonly phases = input.required<ListItem[]>();

  readonly entry = this.store.select(EntryViewState.entry);
  readonly version = this.store.select(EntryViewState.version);
  readonly tasks = this.store.select(EntryViewState.tasks);

  readonly faSpinner = faSpinner;

  phaseTitleChosen(phaseTitle: string): void {
    this.entryService.setupPhaseTaskAsync(phaseTitle).subscribe();
  }
}
