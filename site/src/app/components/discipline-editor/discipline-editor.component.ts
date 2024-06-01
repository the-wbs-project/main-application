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
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogCloseResult,
  DialogModule,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { CategoryDialogResults } from '@wbs/core/models';
import { CategoryService, IdService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { DisciplineIconPipe } from '@wbs/pipes/discipline-icon.pipe';
import { filter, map } from 'rxjs/operators';
import { SwitchComponent } from '../switch';
import { CategoryDialogComponent } from '../category-dialog';

@Component({
  standalone: true,
  selector: 'wbs-discipline-editor',
  templateUrl: './discipline-editor.component.html',
  styleUrl: './discipline-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
  imports: [
    ButtonModule,
    DialogModule,
    DisciplineIconPipe,
    DragDropModule,
    FontAwesomeModule,
    NgClass,
    TranslateModule,
    SwitchComponent,
  ],
})
export class DisciplineEditorComponent {
  private readonly catService = inject(CategoryService);
  private readonly dialogService = inject(DialogService);
  //
  //  IO
  //
  readonly sizeCss = input('tx-16');
  readonly showAdd = input<boolean>(false);
  readonly categoryCreated = output<CategoryDialogResults>();
  //
  //  Models and computes
  //
  readonly categories = model.required<CategorySelection[]>();

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
    CategoryDialogComponent.launchAsync(this.dialogService, false, true)
      .pipe(
        filter((x) => !(x instanceof DialogCloseResult)),
        map((x) => <CategoryDialogResults>x)
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
          icon: result.icon,
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
      return [...list];
    });
  }
}
