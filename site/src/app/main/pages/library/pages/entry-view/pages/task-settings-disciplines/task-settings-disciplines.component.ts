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
import { Category } from '@wbs/core/models';
import { CategorySelection } from '@wbs/core/view-models';
import { DisciplineEditorComponent } from '@wbs/main/components/discipline-editor';
import { SaveButtonComponent } from '@wbs/main/components/save-button.component';
import { DirtyComponent } from '@wbs/main/models';
import { CategorySelectionService } from '@wbs/main/services';
import { EntryService, EntryState, EntryTaskService } from '../../services';
import { delay, tap } from 'rxjs/operators';
import { NgClass } from '@angular/common';

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
  providers: [CategorySelectionService, EntryService],
})
export class DisciplinesComponent implements OnInit, DirtyComponent {
  private readonly catService = inject(CategorySelectionService);
  private readonly service = inject(EntryTaskService);
  readonly state = inject(EntryState);

  readonly checkIcon = faCheck;
  readonly isDirty = signal(false);
  readonly saveState = signal<'ready' | 'saving' | 'saved' | undefined>(
    undefined
  );

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
