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
import { Store } from '@ngxs/store';
import {
  Category,
  PROJECT_NODE_VIEW,
  Project,
  SaveState,
} from '@wbs/core/models';
import { IdService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { CategoryDialogComponent } from '@wbs/main/components/category-dialog';
import { DisciplineEditorComponent } from '@wbs/main/components/discipline-editor';
import { FadingMessageComponent } from '@wbs/main/components/fading-message.component';
import { SaveButtonComponent } from '@wbs/main/components/save-button.component';
import { DirtyComponent } from '@wbs/main/models';
import { CategorySelectionService } from '@wbs/main/services';
import { delay, tap } from 'rxjs/operators';
import { ChangeProjectDiscipines } from '../../actions';
import { ProjectState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './disciplines.component.html',
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
  private readonly store = inject(Store);

  readonly plus = faPlus;
  readonly checkIcon = faCheck;
  readonly cats = input.required<Category[]>();
  readonly isDirty = signal(false);
  readonly showAddDialog = signal(false);
  readonly saveState = signal<SaveState>('ready');
  readonly disciplines = signal<CategorySelection[] | undefined>(undefined);

  ngOnInit(): void {
    this.disciplines.set(
      this.catService.build(
        this.cats() ?? [],
        this.getProject().disciplines ?? []
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

    const results = this.catService.extract(
      this.disciplines(),
      this.getProject().disciplines
    );

    this.store
      .dispatch(new ChangeProjectDiscipines(results))
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

  private getProject(): Project {
    return this.store.selectSnapshot(ProjectState.current)!;
  }
}
