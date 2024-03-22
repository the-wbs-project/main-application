import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Category } from '@wbs/core/models';
import { CategorySelection } from '@wbs/core/view-models';
import { DisciplineEditorComponent } from '@wbs/main/components/discipline-editor';
import { SaveButtonComponent } from '@wbs/main/components/save-button.component';
import { DirtyComponent } from '@wbs/main/models';
import { CategorySelectionService } from '@wbs/main/services';
import { EntryService, EntryState, EntryTaskService } from '../services';
import { delay, tap } from 'rxjs/operators';

@Component({
  standalone: true,
  template: `<div class="card-header tx-medium">
      {{ 'General.Settings' | translate }} >
      {{ 'General.Disciplines' | translate }}
    </div>
    <div class="pd-15 text-center bg-white">
      <div class="d-ib w-100 mx-wd-xs-500 text-start card dashboard-card">
        <div
          class="d-flex card-header bg-gray-200 text-uppercase tx-medium flex-align-center"
        >
          <div class="flex-fill">
            {{ 'Wbs.TaskDisciplines' | translate }}
          </div>
          <div class="text-end">
            <wbs-save-button size="sm" [state]="saveState()" (click)="save()" />
          </div>
        </div>
        <div class="card-body">
          <div class="tx-italic text-center pd-b-10 pd-l-10">
            {{ 'Library.DisciplineSettingsInfoTask' | translate }}
          </div>
          @if (disciplines(); as disciplines) {
          <wbs-discipline-editor
            [categories]="disciplines"
            (saveClicked)="save()"
            (categoriesChange)="isDirty.set(true)"
          />
          }
        </div>
      </div>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineEditorComponent, SaveButtonComponent, TranslateModule],
  providers: [CategorySelectionService, EntryService],
})
export class DisciplinesComponent implements OnInit, DirtyComponent {
  private readonly catService = inject(CategorySelectionService);
  private readonly service = inject(EntryTaskService);
  readonly state = inject(EntryState);

  readonly isDirty = signal(false);
  readonly saveState = signal<'ready' | 'saving' | 'saved'>('ready');

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
    this.saveState.set('saving');
    this.service
      .disciplinesChangedAsync(
        this.taskId(),
        this.disciplines()!
          .filter((x) => x.selected)
          .map((x) => x.id)
      )
      .pipe(
        tap(() => {
          this.isDirty.set(false);
          this.saveState.set('saved');
        }),
        delay(5000)
      )
      .subscribe(() => this.saveState.set('ready'));
  }
}
