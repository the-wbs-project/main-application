import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { LibraryEntryNode, ListItem, ProjectCategory } from '@wbs/core/models';
import { IdService, SignalStore } from '@wbs/core/services';
import { TasksChanged, PhasesChanged } from '../../../actions';
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

  readonly claims = input.required<string[]>();
  readonly phases = input.required<ListItem[]>();

  readonly entry = this.store.select(EntryViewState.entry);
  readonly version = this.store.select(EntryViewState.version);
  readonly tasks = this.store.select(EntryViewState.tasks);

  readonly faSpinner = faSpinner;

  phaseTitleChosen(phaseTitle: string): void {
    const id = IdService.generate();

    const phase: ProjectCategory = {
      id,
      label: phaseTitle,
      order: 1,
      tags: [],
      type: 'phase',
    };
    const node: LibraryEntryNode = {
      id,
      title: phaseTitle,
      entryId: this.entry()!.id,
      entryVersion: this.version()!.version,
      lastModified: new Date(),
      order: 1,
    };
    this.store.dispatch([
      new TasksChanged([node], []),
      new PhasesChanged([phase]),
    ]);
  }
}
