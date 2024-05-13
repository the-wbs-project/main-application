import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { CategorySelectionService } from '@wbs/core/services';
import { DirtyComponent, Project, SaveState } from '@wbs/core/models';
import { CategorySelection, WbsNodeView } from '@wbs/core/view-models';
import { CategoryDialogComponent } from '@wbs/components/category-dialog';
import { DisciplineEditorComponent } from '@wbs/components/discipline-editor';
import { FadingMessageComponent } from '@wbs/components/_utils/fading-message.component';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';
import { delay, tap } from 'rxjs/operators';
import { ChangeTaskDisciplines } from '../../actions';
import { ProjectState, TasksState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './disciplines.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CategoryDialogComponent,
    DisciplineEditorComponent,
    FadingMessageComponent,
    SaveButtonComponent,
    TranslateModule,
  ],
})
export class DisciplinesComponent implements OnInit, DirtyComponent {
  private readonly catService = inject(CategorySelectionService);
  private readonly store = inject(Store);

  readonly checkIcon = faCheck;
  readonly saveState = signal<SaveState>('ready');
  readonly disciplines = signal<CategorySelection[] | undefined>(undefined);
  readonly isDirty = () => this.catService.isListDirty(this.disciplines());

  ngOnInit(): void {
    this.set();
  }

  save(): void {
    this.saveState.set('saving');

    const results = this.disciplines()!
      .filter((x) => x.selected)
      .map((x) => x.id);

    this.store
      .dispatch(new ChangeTaskDisciplines(results))
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
      this.catService.buildDisciplinesFromList(
        this.getProject().disciplines ?? [],
        this.getTask()?.disciplines ?? []
      )
    );
  }

  private getProject(): Project {
    return this.store.selectSnapshot(ProjectState.current)!;
  }

  private getTask(): WbsNodeView {
    return this.store.selectSnapshot(TasksState.current)!;
  }
}
