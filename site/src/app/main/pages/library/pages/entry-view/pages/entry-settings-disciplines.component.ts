import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SignalStore } from '@wbs/core/services';
import { DisciplineEditorComponent } from '@wbs/main/components/discipline-editor';
import { DirtyComponent } from '@wbs/main/models';
import { CategorySelectionService } from '@wbs/main/services';
import { MetadataState } from '@wbs/main/states';
import { EntryService } from '../services';
import { EntryViewState } from '../states';

@Component({
  standalone: true,
  template: `<div class="card-header tx-medium">
      {{ 'General.Settings' | translate }} >
      {{ 'General.Disciplines' | translate }}
    </div>
    <div class="pd-15 text-center bg-white">
      <div class="d-ib w-100 text-start" style="max-width: 500px;">
        @if (disciplines(); as disciplines) {
        <wbs-discipline-editor
          [categories]="disciplines"
          [showSave]="true"
          (saveClicked)="save()"
          (categoriesChange)="isDirty.set(true)"
        />
        }
      </div>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineEditorComponent, TranslateModule],
  providers: [CategorySelectionService, EntryService],
})
export class DisciplinesComponent implements DirtyComponent {
  private readonly catService = inject(CategorySelectionService);
  private readonly service = inject(EntryService);
  private readonly store = inject(SignalStore);

  readonly isDirty = signal(false);

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
      .subscribe(() => this.isDirty.set(false));
  }
}
