import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Category, Project, SaveState } from '@wbs/core/models';
import { IdService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { CategoryDialogComponent } from '@wbs/main/components/category-dialog';
import { DisciplineEditorComponent } from '@wbs/main/components/discipline-editor';
import { FadingMessageComponent } from '@wbs/main/components/fading-message.component';
import { SaveButtonComponent } from '@wbs/main/components/save-button.component';
import { CategoryDialogResults, DirtyComponent } from '@wbs/main/models';
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
  readonly showAddDialog = signal(false);
  readonly saveState = signal<SaveState>('ready');
  readonly disciplines = model<CategorySelection[]>();
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
      description: results.description,
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
          this.set();
          this.saveState.set('saved');
        }),
        delay(5000)
      )
      .subscribe(() => this.saveState.set('ready'));
  }

  private set(): void {
    this.disciplines.set(
      this.catService.buildDisciplines(this.getProject().disciplines ?? [])
    );
    console.log(this.disciplines());
  }

  private getProject(): Project {
    return this.store.selectSnapshot(ProjectState.current)!;
  }
}
