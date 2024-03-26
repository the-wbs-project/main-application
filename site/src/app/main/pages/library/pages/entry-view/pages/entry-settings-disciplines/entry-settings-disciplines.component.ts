import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Category } from '@wbs/core/models';
import { IdService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { CategoryDialogComponent } from '@wbs/main/components/category-dialog';
import { DisciplineEditorComponent } from '@wbs/main/components/discipline-editor';
import { SaveButtonComponent } from '@wbs/main/components/save-button.component';
import { DirtyComponent } from '@wbs/main/models';
import { CategorySelectionService } from '@wbs/main/services';
import { delay, tap } from 'rxjs/operators';
import { EntryService, EntryState } from '../../services';
import { FadingMessageComponent } from '@wbs/main/components/fading-message.component';

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
  providers: [CategorySelectionService],
})
export class DisciplinesComponent implements OnInit, DirtyComponent {
  private readonly catService = inject(CategorySelectionService);
  private readonly service = inject(EntryService);
  readonly state = inject(EntryState);

  readonly plus = faPlus;
  readonly checkIcon = faCheck;
  readonly cats = input.required<Category[]>();
  readonly isDirty = signal(false);
  readonly showAddDialog = signal(false);
  readonly saveState = signal<'ready' | 'saving' | 'saved'>('ready');
  readonly disciplines = signal<CategorySelection[] | undefined>(undefined);

  ngOnInit(): void {
    this.disciplines.set(
      this.catService.build(
        this.cats() ?? [],
        this.state.version()?.disciplines ?? []
      )
    );
  }

  create(results: [string, string] | undefined): void {
    this.showAddDialog.set(false);

    if (results == null) return;

    const item: CategorySelection = {
      id: IdService.generate(),
      isCustom: true,
      label: results[0],
      icon: results[1],
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
          this.isDirty.set(false);
          this.saveState.set('saved');
        }),
        delay(5000)
      )
      .subscribe(() => this.saveState.set('ready'));
  }
}
