import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  faEye,
  faEyeSlash,
  faFloppyDisk,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons';
import {
  CategorySelectionService,
  DialogService,
  IdService,
} from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { CustomDialogComponent } from './custom-dialog/custom-dialog.component';

@Component({
  selector: 'wbs-category-list-editor',
  templateUrl: './category-list-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CategoryListEditorComponent {
  @Input() showButtons = true;
  @Input() showSave = false;
  @Input() categories?: CategorySelection[] | null;
  @Input() categoryType?: 'discipline' | 'phase' | null;
  @Output() readonly saveClicked = new EventEmitter<void>();
  @Output() readonly categoriesChange = new EventEmitter<CategorySelection[]>();

  readonly hideUnselected = signal(false);
  readonly faEye = faEye;
  readonly faEyeSlash = faEyeSlash;
  readonly faFloppyDisk = faFloppyDisk;
  readonly faPlus = faPlus;

  flip = false;

  constructor(
    private readonly catService: CategorySelectionService,
    private readonly dialogService: DialogService
  ) {}

  changed(): void {
    this.rebuild();
  }

  showCreate() {
    this.dialogService
      .openDialog<[string, string] | null>(CustomDialogComponent, {
        scrollable: true,
      })
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
        this.categories = [item, ...this.categories!];

        this.rebuild();
      });
  }

  rebuild() {
    this.catService.renumber(this.categories!);
    this.categoriesChange.emit(this.categories!);
  }
}
