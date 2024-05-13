import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import {
  ListItemDialogComponent,
  ListItemDialogResults,
} from '@wbs/components/list-item-dialog';
import { ListItemFormComponent } from '@wbs/components/list-item-form';
import { CategorySelectionService, IdService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { filter, map } from 'rxjs/operators';
import { DisciplineIconPipe } from '@wbs/pipes/discipline-icon.pipe';
import { SwitchComponent } from '../switch';

@Component({
  standalone: true,
  selector: 'wbs-discipline-editor',
  templateUrl: './discipline-editor.component.html',
  styleUrl: './discipline-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
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
  private readonly catService = inject(CategorySelectionService);
  private readonly dialogService = inject(DialogService);
  //
  //  IO
  //
  readonly showAdd = input<boolean>(false);
  readonly showSave = input<boolean>(false);
  readonly saveClicked = output<void>();
  readonly categoryCreated = output<ListItemDialogResults>();
  //
  //  Models and computes
  //
  readonly categories = model<CategorySelection[]>();
  readonly showButtons = computed(() => this.showAdd() || this.showSave());

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
        map((x) => <ListItemDialogResults>x)
      )
      .subscribe((result) => {
        this.categoryCreated.emit(result);
        if (result == null) return;

        const item: CategorySelection = {
          id: IdService.generate(),
          description: result.description,
          isCustom: true,
          label: result.title,
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
