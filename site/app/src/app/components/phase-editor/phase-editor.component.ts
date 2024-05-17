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
import { CategoryDialogResults } from '@wbs/core/models';
import { CategoryService, IdService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { filter, map } from 'rxjs/operators';
import { CategoryDialogComponent } from '../category-dialog';
import { SwitchComponent } from '../switch';

@Component({
  standalone: true,
  selector: 'wbs-phase-editor',
  templateUrl: './phase-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
  imports: [
    DialogModule,
    DragDropModule,
    FontAwesomeModule,
    NgClass,
    TranslateModule,
    SwitchComponent,
  ],
})
export class PhaseEditorComponent {
  readonly saveClicked = output<void>();

  private readonly catService = inject(CategoryService);
  private readonly dialogService = inject(DialogService);

  readonly faBars = faBars;
  readonly faFloppyDisk = faFloppyDisk;
  readonly faPlus = faPlus;
  readonly categories = model.required<CategorySelection[]>();

  readonly showAdd = input<boolean>(false);
  readonly showSave = input<boolean>(false);
  readonly showButtons = computed(() => this.showAdd() || this.showSave());

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

  add(): void {
    CategoryDialogComponent.launchAsync(
      this.dialogService,
      false,
      true,
      'Wbs.AddPhase'
    )
      .pipe(
        filter((x) => !(x instanceof DialogCloseResult)),
        map((x) => <CategoryDialogResults>x)
      )
      .subscribe((result) => {
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
      return structuredClone(list);
    });
  }
}
