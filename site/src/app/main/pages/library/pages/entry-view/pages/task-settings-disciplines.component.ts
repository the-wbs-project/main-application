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
import { EntryService, EntryState, EntryTaskService } from '../services';
import { CategorySelection } from '@wbs/core/view-models';
import isFirstDayOfMonth from 'date-fns/isFirstDayOfMonth';

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
          message="Library.DisciplineSettingsInfoTask"
        />
      </div>
      <div class="d-ib w-100 text-start" style="max-width: 500px;">
        @if (disciplines(); as disciplines) {
        <wbs-discipline-editor
          [showSave]="true"
          [showAdd]="false"
          [categories]="disciplines"
          (saveClicked)="save()"
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
  private readonly service = inject(EntryTaskService);
  readonly state = inject(EntryState);

  readonly isDirty = signal(false);

  readonly taskId = input.required<string>();
  readonly cats = input.required<Category[]>();

  readonly task = this.state.getTask(this.taskId);
  readonly disciplines = signal<CategorySelection[] | undefined>(undefined);

  ngOnInit(): void {
    const definitions = this.cats();
    const versionList = this.state.version()?.disciplines;
    const cats: Category[] = [];

    if (versionList == undefined) {
      cats.push(...definitions);
    } else {
      for (const x of versionList) {
        if (typeof x === 'string') {
          const id = x;
          const def = definitions.find((x) => x.id === id);

          if (def) cats.push(def);
        } else {
          cats.push(x);
        }
      }
    }
    this.disciplines.set(
      this.catService.build(cats, this.task()?.disciplines ?? [])
    );
  }

  save(): void {
    console.log('hi');
    this.service
      .disciplinesChangedAsync(
        this.taskId(),
        this.disciplines()!
          .filter((x) => x.selected)
          .map((x) => x.id)
      )
      .subscribe(() => this.isDirty.set(false));
  }
}
