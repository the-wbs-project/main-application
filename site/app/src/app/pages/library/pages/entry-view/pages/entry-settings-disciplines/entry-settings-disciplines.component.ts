import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  CategoryDialogResults,
  DirtyComponent,
  SaveState,
} from '@wbs/core/models';
import { CategorySelectionService, IdService } from '@wbs/core/services';
import { EntryService } from '@wbs/core/services/library';
import { CategorySelection } from '@wbs/core/view-models';
import { FadingMessageComponent } from '@wbs/components/_utils/fading-message.component';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';
import { CategoryDialogComponent } from '@wbs/components/category-dialog';
import { DisciplineEditorComponent } from '@wbs/components/discipline-editor';
import { EntryStore } from '@wbs/core/store';
import { delay, tap } from 'rxjs/operators';

@Component({
  standalone: true,
  templateUrl: './entry-settings-disciplines.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CategoryDialogComponent,
    DisciplineEditorComponent,
    FadingMessageComponent,
    FontAwesomeModule,
    SaveButtonComponent,
    TranslateModule,
  ],
})
export class DisciplinesComponent implements OnInit, DirtyComponent {
  private readonly catService = inject(CategorySelectionService);
  private readonly service = inject(EntryService);
  readonly entryStore = inject(EntryStore);

  readonly plus = faPlus;
  readonly checkIcon = faCheck;
  readonly showAddDialog = signal(false);
  readonly saveState = signal<SaveState>('ready');
  readonly disciplines = signal<CategorySelection[] | undefined>(undefined);
  readonly isDirty = () => this.catService.isListDirty(this.disciplines());

  ngOnInit(): void {
    this.set();
  }

  create(results: CategoryDialogResults | undefined): void {
    this.showAddDialog.set(false);

    if (results == null) return;

    const item: CategorySelection = {
      id: IdService.generate(),
      isCustom: true,
      label: results.title,
      icon: results.icon,
      selected: true,
    };
    this.disciplines.update((list) => {
      list = [item, ...(list ?? [])];
      this.catService.renumber(list);
      return list;
    });
  }

  save(): void {
    this.saveState.set('saving');
    this.service
      .disciplinesChangedAsync(
        this.disciplines()!
          .filter((x) => x.selected)
          .map((x) =>
            x.isCustom ? { id: x.id, label: x.label, icon: x.icon } : x.id
          )
      )
      .pipe(
        delay(1000),
        tap(() => {
          this.set();
          this.saveState.set('saved');
        }),
        delay(5000)
      )
      .subscribe(() => this.saveState.set('ready'));
  }

  private set(): void {
    this.disciplines.set(
      this.catService.buildDisciplines(
        this.entryStore.version()?.disciplines ?? []
      )
    );
  }
}
