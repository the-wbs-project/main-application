import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Category } from '@wbs/core/models';
import { AlertComponent } from '@wbs/main/components/alert.component';
import { DisciplineEditorComponent } from '@wbs/main/components/discipline-editor';
import { DirtyComponent } from '@wbs/main/models';
import { CategorySelectionService } from '@wbs/main/services';
import { EntryService, EntryState } from '../services';
import { ListItemDialogResults } from '@wbs/main/components/list-item-dialog';
import { IdService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';

@Component({
  standalone: true,
  template: `<div class="card-header tx-medium">
      {{ 'General.Settings' | translate }} >
      {{ 'General.Disciplines' | translate }}
    </div>
    <div class="pd-15 text-center bg-white">
      <div class="w-100 text-start">
        <wbs-alert
          type="info"
          [dismissible]="false"
          message="Library.DisciplineSettingsInfoEntry"
        />
      </div>
      <div class="d-ib w-100 text-start" style="max-width: 500px;">
        @if (disciplines(); as disciplines) {
        <wbs-discipline-editor
          [showSave]="true"
          [categories]="disciplines"
          (saveClicked)="save()"
          (categoryCreated)="created($event)"
          (categoriesChange)="isDirty.set(true)"
        />
        }
      </div>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlertComponent, DisciplineEditorComponent, TranslateModule],
  providers: [CategorySelectionService, EntryService],
})
export class DisciplinesComponent implements OnInit, DirtyComponent {
  private readonly catService = inject(CategorySelectionService);
  private readonly service = inject(EntryService);
  readonly state = inject(EntryState);

  readonly isDirty = signal(false);

  readonly cats = input.required<Category[]>();
  readonly disciplines = signal<CategorySelection[] | undefined>(undefined);

  ngOnInit(): void {
    this.disciplines.set(
      this.catService.build(
        this.cats() ?? [],
        this.state.version()?.disciplines ?? []
      )
    );
  }

  created(data: ListItemDialogResults) {
    const item: CategorySelection = {
      id: IdService.generate(),
      description: data.description ?? '',
      isCustom: true,
      label: data.title,
      number: null,
      selected: true,
    };
    this.disciplines.update((list) => {
      list = [item, ...(list ?? [])];
      this.catService.renumber(list);
      return list;
    });
  }

  save(): void {
    console.log(this.disciplines());
    this.service
      .disciplinesChangedAsync(
        this.disciplines()!
          .filter((x) => x.selected)
          .map((x) => (x.isCustom ? { id: x.id, label: x.label } : x.id))
      )
      .subscribe(() => this.isDirty.set(false));
  }
}
