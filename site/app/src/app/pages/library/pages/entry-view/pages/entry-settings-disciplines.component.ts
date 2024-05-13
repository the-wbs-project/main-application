import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DisciplineSettingsPageComponent } from '@wbs/components/discipline-settings-page';
import { DirtyComponent, LibraryEntryVersion } from '@wbs/core/models';
import { CategorySelectionService, SaveService } from '@wbs/core/services';
import { EntryService } from '@wbs/core/services/library';
import { EntryStore } from '@wbs/core/store';
import { CategorySelection } from '@wbs/core/view-models';

@Component({
  standalone: true,
  template: `<wbs-discipline-settings-page
    [canAdd]="true"
    [saveService]="saveService"
    [(disciplines)]="disciplines"
    (saveClicked)="save()"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineSettingsPageComponent],
})
export class DisciplinesComponent implements OnInit, DirtyComponent {
  private readonly catService = inject(CategorySelectionService);
  private readonly service = inject(EntryService);
  readonly entryStore = inject(EntryStore);

  readonly saveService = new SaveService();
  readonly disciplines = signal<CategorySelection[] | undefined>(undefined);
  readonly isDirty = () => this.catService.isListDirty(this.disciplines());

  constructor() {
    effect(() => this.set(this.entryStore.version()), {
      allowSignalWrites: true,
    });
  }

  ngOnInit(): void {}

  save(): void {
    const results = this.catService.extract(
      this.disciplines(),
      this.entryStore.version()?.disciplines ?? []
    );

    this.saveService
      .call(this.service.disciplinesChangedAsync(results.categories))
      .subscribe();
  }

  private set(version: LibraryEntryVersion | undefined): void {
    this.disciplines.set(
      this.catService.buildDisciplines(version?.disciplines ?? [])
    );
  }
}
