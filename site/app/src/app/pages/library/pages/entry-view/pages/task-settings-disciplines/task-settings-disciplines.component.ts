import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Category, DirtyComponent, SaveState } from '@wbs/core/models';
import { CategorySelectionService } from '@wbs/core/services';
import { EntryTaskService } from '@wbs/core/services/library';
import { CategorySelection } from '@wbs/core/view-models';
import { DisciplineEditorComponent } from '@wbs/components/discipline-editor';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';
import { EntryStore } from '@wbs/store';
import { delay, tap } from 'rxjs/operators';

@Component({
  standalone: true,
  templateUrl: './task-settings-disciplines.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DisciplineEditorComponent,
    FontAwesomeModule,
    NgClass,
    SaveButtonComponent,
    TranslateModule,
  ],
})
export class DisciplinesComponent implements OnInit, DirtyComponent {
  private readonly catService = inject(CategorySelectionService);
  private readonly service = inject(EntryTaskService);
  readonly entryStore = inject(EntryStore);

  readonly checkIcon = faCheck;
  readonly saveState = signal<SaveState>('ready');

  readonly taskId = input.required<string>();
  readonly cats = input.required<Category[]>();

  readonly task = this.entryStore.getTask(this.taskId);
  readonly disciplines = signal<CategorySelection[] | undefined>(undefined);
  readonly isDirty = () => this.catService.isListDirty(this.disciplines());

  ngOnInit(): void {
    this.set();
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
      this.catService.buildFromList(
        this.cats() ?? [],
        this.entryStore.version()?.disciplines ?? [],
        this.task()?.disciplines ?? []
      )
    );
  }
}
