import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faFloppyDisk, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogCloseResult,
  DialogModule,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { IdService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { CategorySelectionService } from '@wbs/main/services';
import { filter, map } from 'rxjs/operators';
import { DisciplineIconPipe } from '../../pipes/discipline-icon.pipe';
import { ListItemDialogComponent } from '../list-item-dialog/list-item-dialog.component';
import { ListItemFormComponent } from '../list-item-form';
import { SwitchComponent } from '../switch';

@Component({
  standalone: true,
  selector: 'wbs-discipline-editor',
  templateUrl: './discipline-editor.component.html',
  styleUrl: './discipline-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CategorySelectionService, DialogService],
  imports: [
    DialogModule,
    DisciplineIconPipe,
    DragDropModule,
    FontAwesomeModule,
    ListItemFormComponent,
    NgClass,
    TranslateModule,
    SwitchComponent,
  ],
})
export class DisciplineEditorComponent {
  readonly saveClicked = output<void>();

  private readonly catService = inject(CategorySelectionService);
  private readonly dialogService = inject(DialogService);

  readonly categories = model<CategorySelection[]>();
  readonly showButtons = input<boolean>(true);
  readonly showSave = input<boolean>(false);

  readonly faBars = faBars;
  readonly faFloppyDisk = faFloppyDisk;
  readonly faPlus = faPlus;

  onDrop({ previousIndex, currentIndex }: CdkDragDrop<any, any>): void {
    this.categories.update((list) => {
      if (list === undefined) list = [];

      const toMove = list[previousIndex];

      list.splice(previousIndex, 1);
      list.splice(currentIndex, 0, toMove);

      this.catService.renumber(list);

      return list;
    });
  }

  showCreate() {
    const dialogRef = this.dialogService.open({
      content: ListItemDialogComponent,
    });

    (<ListItemDialogComponent>dialogRef.content.instance).showDescription.set(
      false
    );
    dialogRef.result
      .pipe(
        filter((x) => !(x instanceof DialogCloseResult)),
        map((x) => <[string, string]>x)
      )
      .subscribe((result) => {
        if (result == null) return;

        const item: CategorySelection = {
          id: IdService.generate(),
          description: result[1],
          isCustom: true,
          label: result[0],
          number: null,
          selected: true,
        };
        this.categories.update((list) => {
          list = [item, ...(list ?? [])];
          this.catService.renumber(list);
          return list;
        });
      });
  }

  rebuild(): void {
    this.categories.update((list) => {
      this.catService.renumber(list);
      return list;
    });
  }
}
