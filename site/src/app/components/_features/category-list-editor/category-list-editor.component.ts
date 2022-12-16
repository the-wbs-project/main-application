import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { faEye, faEyeSlash, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { faCircle } from '@fortawesome/pro-thin-svg-icons';
import { PROJECT_NODE_VIEW_TYPE } from '@wbs/core/models';
import {
  CategorySelectionService,
  DialogService,
  IdService,
} from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { BehaviorSubject } from 'rxjs';
import { CustomDialogComponent } from './custom-dialog/custom-dialog.component';

@Component({
  selector: 'app-category-list-editor',
  templateUrl: './category-list-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CategoryListEditorComponent {
  @Input() showButtons = true;
  @Input() categories?: CategorySelection[];
  @Input() categoryType?: PROJECT_NODE_VIEW_TYPE;
  @Output() categoriesChange = new EventEmitter<CategorySelection[]>();

  readonly hideUnselected$ = new BehaviorSubject<boolean>(false);
  readonly faCircle = faCircle;
  readonly faEye = faEye;
  readonly faEyeSlash = faEyeSlash;
  readonly faPlus = faPlus;

  flip = false;

  constructor(
    private readonly catService: CategorySelectionService,
    private readonly dialogService: DialogService
  ) {}

  changed(): void {
    this.catService.renumber(this.categories);
    this.categoriesChange.emit(this.categories);
  }

  showCreate() {
    this.dialogService
      .openDialog<[string, string] | null>(CustomDialogComponent, {
        scrollable: true,
      })
      .subscribe((result) => {
        console.log(result);
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

        this.changed();
      });
  }
}
