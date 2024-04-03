import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  inject,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { EditorModule } from '@progress/kendo-angular-editor';
import { WbsNode } from '@wbs/core/models';
import { CategorySelection } from '@wbs/core/view-models';
import { TaskCreationResults } from '@wbs/main/models';
import { CategorySelectionService } from '@wbs/main/services';
import { DisciplineEditorComponent } from '../discipline-editor';

@Component({
  standalone: true,
  selector: 'wbs-task-create',
  templateUrl: './task-create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogModule,
    DisciplineEditorComponent,
    EditorModule,
    FormsModule,
    TranslateModule,
  ],
  providers: [CategorySelectionService],
})
export class TaskCreateComponent {
  @Output() readonly ready = new EventEmitter<
    TaskCreationResults | undefined
  >();

  private readonly catService = inject(CategorySelectionService);
  readonly titleTextBox = viewChild<ElementRef>('titleTextBox');

  protected readonly showDialog = signal<boolean>(false);
  protected readonly more = signal<boolean>(false);
  protected readonly title = model<string>('');
  protected readonly description = model<string>('');
  protected readonly disciplines = signal<CategorySelection[]>(
    this.catService.buildDisciplinesFromList(
      //PROJECT_NODE_VIEW.DISCIPLINE,
      [],
      []
    )
  );

  show(): void {
    this.title.set('');
    this.description.set('');
    this.disciplines.update((list) => {
      for (const cat of list) cat.selected = false;

      return list;
    });
    this.showDialog.set(true);
    this.titleTextBox()?.nativeElement.focus();
  }

  protected cancel(): void {
    this.ready.emit(undefined);
    this.showDialog.set(false);
  }

  protected save(nav: boolean): void {
    if (!this.title) return;

    const model: Partial<WbsNode> = {
      title: this.title().trim(),
    };

    if (this.more()) {
      const description = this.description()?.trim();

      if (description !== '') model.description = description;

      const disciplines: string[] = [];

      for (const cat of this.disciplines()) {
        if (cat.selected) disciplines.push(cat.id);
      }
      if (disciplines.length > 0) model.disciplineIds = disciplines;
    }
    this.ready.emit({ model, nav });
    this.showDialog.set(false);
  }
}
