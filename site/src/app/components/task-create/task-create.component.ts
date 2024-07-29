import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogCloseResult,
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { ProjectCategory, WbsNode } from '@wbs/core/models';
import { CategoryService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DisciplineEditorComponent } from '../discipline-editor';

@Component({
  standalone: true,
  selector: 'wbs-task-create',
  templateUrl: './task-create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DialogModule,
    DisciplineEditorComponent,
    EditorModule,
    FormsModule,
    TextBoxModule,
    TranslateModule,
  ],
})
export class TaskCreateComponent extends DialogContentBase {
  private readonly catService = inject(CategoryService);
  readonly titleTextBox = viewChild<ElementRef>('titleTextBox');

  protected readonly title = model<string>('');
  protected readonly description = model<string>('');
  protected readonly disciplines = signal<CategorySelection[]>([]);

  constructor(x: DialogRef) {
    super(x);
  }

  static launchAsync(
    dialog: DialogService,
    disciplines: ProjectCategory[]
  ): Observable<Partial<WbsNode> | undefined> {
    const ref = dialog.open({
      content: TaskCreateComponent,
      cssClass: 'bg-light',
    });
    const comp = ref.content.instance as TaskCreateComponent;

    comp.title.set('');
    comp.description.set('');
    comp.disciplines.set(
      comp.catService.buildDisciplinesFromList(disciplines, [])
    );
    comp.titleTextBox()?.nativeElement.focus();

    return ref.result.pipe(
      map((x: unknown) =>
        x instanceof DialogCloseResult ? undefined : <Partial<WbsNode>>x
      )
    );
  }

  protected save(): void {
    if (!this.title) return;

    this.dialog.close({
      title: this.title().trim(),
      description: this.description()?.trim(),
      disciplineIds: this.disciplines()
        .filter((x) => x.selected)
        .map((x) => x.id),
    });
  }
}
