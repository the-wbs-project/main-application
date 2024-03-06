import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { PROJECT_NODE_VIEW, ProjectCategory } from '@wbs/core/models';
import { CategorySelection } from '@wbs/core/view-models';
import { DisciplineEditorComponent } from '@wbs/main/components/discipline-editor';
import { DirtyComponent } from '@wbs/main/models';
import { CategorySelectionService } from '@wbs/main/services';
import { MetadataState } from '@wbs/main/states';
import { EntryViewState } from '../states';
import { SignalStore } from '@wbs/core/services';
import { EntryService } from '../services';

@Component({
  standalone: true,
  template: `<div class="card-header tx-medium">
      {{ 'General.Settings' | translate }} >
      {{ 'General.Disciplines' | translate }}
    </div>
    <div class="pd-15">
      @if (disciplines(); as disciplines) {
      <wbs-discipline-editor
        [categories]="disciplines"
        [showSave]="true"
        (saveClicked)="save()"
        (categoriesChange)="isDirty = true"
      />
      }
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineEditorComponent, TranslateModule],
  providers: [CategorySelectionService],
})
export class DisciplinesComponent implements DirtyComponent {
  private readonly catService = inject(CategorySelectionService);
  private readonly service = inject(EntryService);
  private readonly store = inject(SignalStore);

  isDirty = false;

  readonly cats = this.store.select(MetadataState.disciplines);
  readonly version = this.store.select(EntryViewState.version);
  readonly disciplines = computed(() =>
    this.catService.build(this.cats() ?? [], this.version()?.disciplines ?? [])
  );

  constructor() {}

  save(): void {
    this.service
      .disciplinesChangedAsync(
        this.disciplines()
          .filter((x) => x.selected)
          .map((x) => (x.isCustom ? { id: x.id, label: x.label } : x.id))
      )
      .subscribe();
    /* const project = this.store.selectSnapshot(ProjectState.current)!;
    const results = this.catService.extract(
      this.categories,
      project.disciplines
    );

    this.store.dispatch(
      new ChangeProjectCategories(PROJECT_NODE_VIEW.DISCIPLINE, results)
    );
    this.isDirty = false;*/
  }
}
