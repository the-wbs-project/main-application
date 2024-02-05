import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryEntry, LibraryEntryNode, ListItem } from '@wbs/core/models';
import { IdService, SignalStore } from '@wbs/core/services';
import { EntryViewState } from '../../../states';
import { PhaseSetupComponent } from './components/phase-setup';

@Component({
  standalone: true,
  templateUrl: './tasks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, PhaseSetupComponent, TranslateModule],
})
export class TasksPageComponent implements OnInit {
  readonly entry = this.store.select(EntryViewState.entry);
  readonly version = this.store.select(EntryViewState.version);
  readonly tasks = signal<LibraryEntryNode[] | undefined>(undefined);
  readonly phases = input.required<ListItem[]>();
  readonly faSpinner = faSpinner;

  constructor(
    private readonly data: DataServiceFactory,
    private readonly store: SignalStore
  ) {}

  ngOnInit(): void {
    const entry = this.entry();
    const version = this.version();

    if (!entry || !version) return;

    this.data.libraryEntryNodes
      .getAllAsync(entry.owner, entry.id, version.version)
      .subscribe((tasks) => this.tasks.set(tasks));
  }

  phaseTitleChosen(phaseTitle: string): void {
    console.log(phaseTitle);
    const node: LibraryEntryNode = {
      id: IdService.generate(),
      title: phaseTitle,
      entryId: this.entry()!.id,
      entryVersion: this.version()!.version,
      lastModified: new Date(),
      order: 1,
    };
  }
}
